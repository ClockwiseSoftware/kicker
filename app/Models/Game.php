<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\User;

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
                // do something...
            }
        }

        $this->status = static::STATUS_CANCELED;
        if (!$this->save()) {
            // do something...
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
            // do something ...
        }

        return $this;
    }

    protected function setUsers($teamAUsers, $teamBUsers)
    {
        if (count($teamAUsers) === 0 || count($teamBUsers) === 0)
            return false;

        $gameResult = $this->getGameResult();
        list($teamARatings, $teamBRatings) = GameProcessor::calculateRatingForTeams(
            $teamAUsers, $teamBUsers, $gameResult
        );

        $teams = [
            [
                'teamIndex' => $this::TEAM_A_INDEX,
                'users' => $teamAUsers,
                'ratings' => $teamARatings,
                'gameResult' => $gameResult
            ], [
                'teamIndex' => $this::TEAM_B_INDEX,
                'users' => $teamBUsers,
                'ratings' => $teamBRatings,
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
                    // do something...
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
        $self = parent::create($attributes);
        $chunkSize = 50;

        if (!$self)
            return null;

        /* @var static $self */
        $countAllGames = self::count();
        $currentPosition = $self->currentPosition();
        $isLastGame = ($currentPosition + 1 === $countAllGames) ? true : false;

        // If new game has a last position just adding it to the end without recalculation.
        if ($isLastGame) {
            $usersATeam = User::whereIn('id', $attributes['games_users_a'])->get();
            $usersBTeam = User::whereIn('id', $attributes['games_users_b'])->get();
            $self->setUsers($usersATeam, $usersBTeam);

            return $self;
        } else {
            static::where('played_at', '>', $self->played_at)
                ->orderBy('played_at', 'DESC')
                ->chunk($chunkSize, function($games) {
                    foreach ($games as $game) {
                        $game->cancel();
                    }
                });

            $usersATeam = User::whereIn('id', $attributes['games_users_a'])->get();
            $usersBTeam = User::whereIn('id', $attributes['games_users_b'])->get();
            $self->setUsers($usersATeam, $usersBTeam);

            static::where('played_at', '>', $self->played_at)
                ->orderBy('played_at', 'ASC')
                ->chunk($chunkSize, function($games) {
                    foreach ($games as $game) {
                        $game->activate();
                    }
                });
        }

        return $self;
    }

    public function update(array $attributes = [], array $options = [])
    {
        $chunkSize = 50;
        $currentGameId = $this->id;
        $usersAIds = $attributes['games_users_a'];
        $usersBIds = $attributes['games_users_b'];
        $oldPlayedAt = strtotime($this->played_at);
        $this->fill($attributes);
        $newPlayedAt = strtotime($this->played_at);
        $playedAt = date('c', min($oldPlayedAt, $newPlayedAt));

        static::where('played_at', '>=', $playedAt)
            ->orWhere('id', '=', $this->id)
            ->orderBy('played_at', 'DESC')
            ->chunk($chunkSize, function($games) {
                foreach ($games as $game) {
                    $game->cancel();
                }
            });

        if (!$this->save()) {
            // do something ...
        }

        static::where('status', static::STATUS_CANCELED)
            ->orderBy('played_at', 'ASC')
            ->chunk($chunkSize, function($games) use ($currentGameId, $usersAIds, $usersBIds) {
                foreach ($games as $game) {
                    $usersATeam = null;
                    $usersBTeam = null;

                    if ($game->id == $currentGameId) {
                        $usersATeam = User::whereIn('id', $usersAIds)->get();
                        $usersBTeam = User::whereIn('id', $usersBIds)->get();
                    }

                    $game->activate($usersATeam, $usersBTeam);
                }
            });

        return true;
    }
}