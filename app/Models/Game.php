<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\User;
use DB;

class Game extends Model
{
    const TEAM_A_INDEX = 'a';
    const TEAM_B_INDEX = 'b';

    const STATUS_CREATED = 0;
    const STATUS_ACTIVE = 1;
    const STATUS_CANCELED = 2;

    protected $table = 'games';
    protected $fillable = ['played_at', 'team_a_points', 'team_b_points'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gamesUsers()
    {
        return $this->hasMany(GameUser::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gamesUsersA()
    {
        return $this->hasMany(GameUser::class)->where('team_index', static::TEAM_A_INDEX);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gamesUsersB()
    {
        return $this->hasMany(GameUser::class)->where('team_index', static::TEAM_B_INDEX);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function usersA()
    {
        $users = [];
        foreach ($this->gamesUsersA as $gamesUsers) {
            $users[] = $gamesUsers->user;
        }

        return $users;
    }

    public function usersB()
    {
        $users = [];
        foreach ($this->gamesUsersB as $gamesUsers) {
            $users[] = $gamesUsers->user;
        }

        return $users;
    }

    /**
     * @return float|int
     */
    public function getGameResult()
    {
        if ($this->team_a_points > $this->team_b_points) {
            return GameProcessor::WIN;
        } elseif ($this->team_a_points < $this->team_b_points) {
            return GameProcessor::LOSE;
        } else {
            return GameProcessor::DRAW;
        }
    }

    public function getPointsDelta()
    {
        return abs($this->team_a_points - $this->team_b_points);
    }

    /**
     * @param $value
     * @return $this
     */
    public function setPlayedAtAttribute($value)
    {
        $this->attributes['played_at'] = date('c', strtotime($value));
        return $this;
    }

    /**
     * @return bool|string
     */
    public function getPlayedAt()
    {
        return date('m/d/Y H:i', strtotime($this->attributes['played_at']));
    }

    public function scopeForUser($query, $user)
    {
        return $query->whereRaw("`games`.`id` IN (SELECT `game_id` FROM `games_users` WHERE `user_id` = {$user->id})");
    }

    protected function cancel()
    {
        $gamesUsers = $this->gamesUsers()->with('user')->get();

        foreach ($gamesUsers as $gameUser) {
            $gameResult = $this->getGameResult();

            if ($gameUser->team_index === static::TEAM_B_INDEX) {
                $gameResult = GameProcessor::oppositeResult($gameResult);
            }

            $ratingBefore = $gameUser->rating_before;
            $user = $gameUser->user;

            /* @var User $user */
            $user->rating = $ratingBefore;
            $user->rollbackStats($gameResult);

            if (!$user->save()) {
                return false;
            }
        }

        $this->status = static::STATUS_CANCELED;
        if (!$this->save()) {
            return false;
        }

        return $this;
    }

    protected function activate($usersATeam = null, $usersBTeam = null)
    {
        if ($usersATeam === null)
            $usersATeam = User::whereIn('id', $this->gamesUsersA()->pluck('user_id'))->get();
        if ($usersBTeam === null)
            $usersBTeam = User::whereIn('id', $this->gamesUsersB()->pluck('user_id'))->get();

        $this->gamesUsers()->delete();

        $this->setUsers($usersATeam, $usersBTeam);
        $this->status = static::STATUS_ACTIVE;

        if (!$this->save()) {
            return false;
        }

        return $this;
    }

    protected function setUsers($teamAUsers, $teamBUsers)
    {
        if (count($teamAUsers) === 0 || count($teamBUsers) === 0)
            return false;

        $gameResult = $this->getGameResult();
        $teamRatings = GameProcessor::calculateRatingForTeams(
            $teamAUsers, $teamBUsers, $gameResult, $this->getPointsDelta()
        );

        $teams = [
            [
                'teamIndex' => $this::TEAM_A_INDEX,
                'users' => $teamAUsers,
                'ratings' => $teamRatings[GameProcessor::TEAM_A],
                'gameResult' => $gameResult
            ], [
                'teamIndex' => $this::TEAM_B_INDEX,
                'users' => $teamBUsers,
                'ratings' => $teamRatings[GameProcessor::TEAM_B],
                'gameResult' => GameProcessor::oppositeResult($gameResult)
            ]
        ];

        foreach ($teams as $team) {
            $teamIndex = $team['teamIndex'];
            $users = $team['users'];
            $ratings = $team['ratings'];
            $gameResult = $team['gameResult'];

            foreach ($users as $user) {
                $gameUser = GameUser::create([
                    'game_id' => $this->id,
                    'user_id' => $user->id,
                    'team_index' => $teamIndex,
                    'rating_before' => $user->rating,
                    'rating_after' => array_shift($ratings)
                ]);

                /* @var User $user */
                $user->rating = $gameUser->rating_after;
                $user->changeStats($gameResult);

                if (!$user->save()) {
                    return false;
                }
            }
        }

        return $this;
    }

    public function currentPosition()
    {
        return (int) Game::where('played_at', '<=', $this->played_at)
            ->where('id', '!=', (int) $this->id)
            ->orderBy('played_at', 'asc')
            ->count();
    }

    public static function create(array $attributes = [])
    {
        $self = null;

        try {
            DB::transaction(function () use (&$self, $attributes) {
                $self = parent::create($attributes);
                $chunkSize = 50;

                if (!$self) {
                    throw new \ErrorException('Could not create Game');
                }

                /* @var static $self */
                $countAllGames = self::count();
                $currentPosition = $self->currentPosition();
                $isLastGame = ($currentPosition + 1 === $countAllGames) ? true : false;

                // If new game has a last position just adding it to the end without recalculation.
                if ($isLastGame) {
                    $usersATeam = User::whereIn('id', $attributes['games_users_a'])->get();
                    $usersBTeam = User::whereIn('id', $attributes['games_users_b'])->get();

                    if (!$self->setUsers($usersATeam, $usersBTeam)) {
                        throw new \ErrorException('Could not set users for Game #' . $self->id);
                    }

                    return $self;
                }

                // Recalculate games which are dependent from added game.
                while (true) {
                    $games = static::where('played_at', '>', $self->played_at)
                        ->where('status', self::STATUS_ACTIVE)
                        ->orderBy('played_at', 'DESC')
                        ->take($chunkSize)
                        ->get();

                    if (!$games->count())
                        break;

                    $games->each(function ($game) {
                        if (!$game->cancel()) {
                            throw new \ErrorException('Could not cancel Game #' . $game->id);
                        }
                    });
                }

                $usersATeam = User::whereIn('id', $attributes['games_users_a'])->get();
                $usersBTeam = User::whereIn('id', $attributes['games_users_b'])->get();

                if (!$self->setUsers($usersATeam, $usersBTeam)) {
                    throw new \ErrorException('Could not set users for Game #' . $self->id);
                }

                while (true) {
                    $games = static::where('played_at', '>', $self->played_at)
                        ->where('status', self::STATUS_CANCELED)
                        ->orderBy('played_at', 'ASC')
                        ->take($chunkSize)
                        ->get();

                    if (!$games->count())
                        break;

                    $games->each(function ($game) {
                        if (!$game->activate()) {
                            throw new \ErrorException('Could not activate Game #' . $game->id);
                        }
                    });
                }
            });
        } catch (\ErrorException $e) {
            return false;
        }

        return $self;
    }

    public function update(array $attributes = [], array $options = [])
    {
        try {
            DB::transaction(function () use ($attributes, $options) {
                $chunkSize = 50;
                $currentGameId = $this->id;
                $usersAIds = $attributes['games_users_a'];
                $usersBIds = $attributes['games_users_b'];
                $oldPlayedAt = strtotime($this->played_at);
                $this->fill($attributes);
                $newPlayedAt = strtotime($this->played_at);
                $playedAt = date('c', min($oldPlayedAt, $newPlayedAt));

                while (true) {
                    $games = static::whereRaw("(played_at >= '{$playedAt}' OR id = {$this->id})")
                        ->where('status', self::STATUS_ACTIVE)
                        ->take($chunkSize)
                        ->orderBy('played_at', 'DESC')
                        ->get();

                    if (!$games->count())
                        break;

                    $games->each(function ($game) {
                        if (!$game->cancel()) {
                            throw new \ErrorException('Could not cancel Game #' . $game->id);
                        }
                    });
                }

                if (!$this->save()) {
                    throw new \ErrorException('Could not update Game #' . $this->id);
                }

                while (true) {
                    $games = static::where('status', static::STATUS_CANCELED)
                        ->orderBy('played_at', 'ASC')
                        ->take($chunkSize)
                        ->get();

                    if (!$games->count())
                        break;

                    $games->each(function ($game) use ($currentGameId, $usersAIds, $usersBIds) {
                        $usersATeam = null;
                        $usersBTeam = null;

                        if ($game->id == $currentGameId) {
                            $usersATeam = User::whereIn('id', $usersAIds)->get();
                            $usersBTeam = User::whereIn('id', $usersBIds)->get();
                        }

                        if (!$game->activate($usersATeam, $usersBTeam)) {
                            throw new \ErrorException('Could not activate Game #' . $game->id);
                        }
                    });
                }
            });
        } catch (\ErrorException $e) {
            return false;
        }

        return true;
    }

    public function delete()
    {
        try {
            DB::transaction(function () {
                $chunkSize = 50;
                $playedAt = date('c', strtotime($this->played_at));

                while (true) {
                    $games = static::whereRaw("(played_at >= '{$playedAt}' OR id = {$this->id})")
                        ->where('status', self::STATUS_ACTIVE)
                        ->take($chunkSize)
                        ->orderBy('played_at', 'DESC')
                        ->get();

                    if (!$games->count())
                        break;

                    $games->each(function ($game) {
                        if (!$game->cancel()) {
                            throw new \ErrorException('Could not cancel Game #' . $game->id);
                        }
                    });
                }

                if (!parent::delete()) {
                    throw new \ErrorException('Could not delete Game #' . $game->id);
                }

                while (true) {
                    $games = static::where('status', static::STATUS_CANCELED)
                        ->orderBy('played_at', 'ASC')
                        ->take($chunkSize)
                        ->get();

                    if (!$games->count())
                        break;

                    $games->each(function ($game) {
                        if (!$game->activate()) {
                            throw new \ErrorException('Could not cancel Game #' . $game->id);
                        }
                    });
                }

                return true;
            });
        } catch (\ErrorException $e) {
            return false;
        }

        return true;
    }
}