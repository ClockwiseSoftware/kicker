<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    const TEAM_A_INDEX = 'a';
    const TEAM_B_INDEX = 'b';

    protected $table = 'games';

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

    public function addUsers(array $teamAUsers, array $teamBUsers)
    {
        if (!$this->gamesUsersA->isEmpty())
            return false;

        $gameResult = $this->getGameResult();

        list($teamARatings, $teamBRatings) = GameProcessor::calculateRatingForTeams(
            $teamAUsers, $teamBUsers, $gameResult
        );

        foreach ($teamAUsers as $user) {
            $gameUser = GameUser::create([
                'game_id' => $this->id,
                'user_id' => $user->id,
                'team_index' => static::TEAM_A_INDEX,
                'rating_before' => $user->rating,
                'rating_after' => array_pop($teamARatings)
            ]);

            $user->rating = $gameUser->rating_after;

            if ($gameResult === GameProcessor::WIN)
                $user->count_wins++;
            elseif ($gameResult === GameProcessor::LOSE)
                $user->count_looses++;
            else
                $user->count_draws++;

            $user->save();
        }

        foreach ($teamBUsers as $user) {
            $gameUser = GameUser::create([
                'game_id' => $this->id,
                'user_id' => $user->id,
                'team_index' => static::TEAM_B_INDEX,
                'rating_before' => $user->rating,
                'rating_after' => array_pop($teamBRatings)
            ]);

            if ($gameResult === GameProcessor::WIN)
                $user->count_looses++;
            elseif ($gameResult === GameProcessor::LOSE)
                $user->count_wins++;
            else
                $user->count_draws++;

            $user->rating = $gameUser->rating_after;
            $user->save();
        }
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
}