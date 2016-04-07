<?php

namespace App\Models;

use Psy\Exception\ErrorException;

class GameProcessor
{
    const NEW_BEE_MATCHES_EDGE = 30;
    const PRO_RATING_EDGE = 2400;

    const WIN = 1;
    const LOSE = 0;
    const DRAW = 0.5;

    const TEAM_A = 0;
    const TEAM_B = 1;

    const POINTS_FOR_NEW_BEE = 40;
    const POINTS_FOR_MEDIUM = 20;
    const POINTS_FOR_PRO = 10;

    /**
     * @param $ratingA
     * @param $ratingB
     * @param $matchResult
     * @param $matchesCount
     * @return mixed
     */
    protected function newRating($ratingA, $ratingB, $matchResult, $matchesCount)
    {
        $e = 1 / (1 + pow(10, ($ratingB - $ratingA) / 400));

        if ($matchesCount <= static::NEW_BEE_MATCHES_EDGE)
            $k = static::POINTS_FOR_NEW_BEE;
        elseif ($ratingA >= static::PRO_RATING_EDGE)
            $k = static::POINTS_FOR_PRO;
        else
            $k = static::POINTS_FOR_MEDIUM;

        return $ratingA + $k * ($matchResult - $e);
    }

    /**
     * @param $users
     * @return float
     * @throws ErrorException
     */
    protected function teamRating($users)
    {
        if (count($users) === 0)
            throw new ErrorException('No users has been provided');

        $result = 0;

        foreach ($users as $user) {
            $result += (int) $user->rating;
        }

        return $result / count($users);
    }

    /**
     * @param $users
     * @return float
     * @throws ErrorException
     */
    protected function gamesPlayed($users)
    {
        if (count($users) === 0)
            throw new ErrorException('No users has been provided');

        $gamesPlayed = 0;

        foreach ($users as $user) {
            $gamesPlayed += $user->getCountGames();
        }

        return (int) $gamesPlayed / count($users);
    }

    /**
     * @param $users
     * @param $oldTeamRating
     * @param $newTeamRating
     * @return array
     */
    protected function newUsersRating($users, $oldTeamRating, $newTeamRating)
    {
        if (count($users) === 0)
            throw new ErrorException('No users has been provided');

        $result = [];
        $ratingDelta = ($newTeamRating - $oldTeamRating) / count($users);

        foreach ($users as $user) {
            $result[] = (int) ($user->rating + $ratingDelta);
        }

        return $result;
    }

    public static function calculateRatingForTeams($teamA, $teamB, $result)
    {
        $processor = new static();

        $teamsRatings = [
            static::TEAM_A => $processor->teamRating($teamA),
            static::TEAM_B => $processor->teamRating($teamB)
        ];

        if ($result === static::LOSE) {
            $resultA = static::LOSE;
            $resultB = static::WIN;
        } elseif ($result === static::WIN) {
            $resultA = static::WIN;
            $resultB = static::LOSE;
        } else
            $resultA = $resultB = static::DRAW;

        $newTeamsRating[static::TEAM_A] = $processor->newRating(
            $teamsRatings[static::TEAM_A], $teamsRatings[static::TEAM_B], $resultA, $processor->gamesPlayed($teamA)
        );
        $newTeamsRating[static::TEAM_B] = $processor->newRating(
            $teamsRatings[static::TEAM_B], $teamsRatings[static::TEAM_A], $resultB, $processor->gamesPlayed($teamB)
        );

        $newTeamA = $processor->newUsersRating(
            $teamA, $teamsRatings[static::TEAM_A], $newTeamsRating[static::TEAM_A]
        );
        $newTeamB = $processor->newUsersRating(
            $teamB, $teamsRatings[static::TEAM_B], $newTeamsRating[static::TEAM_B]
        );

        return [$newTeamA, $newTeamB];
    }

    public static function addUsersToGame(Game $game, $teamAUsers, $teamBUsers)
    {
        if (!$game->gamesUsersA->isEmpty())
            return false;

        if (count($teamAUsers) === 0 || count($teamBUsers) === 0)
            return false;

        $gameResult = $game->getGameResult();

        list($teamARatings, $teamBRatings) = GameProcessor::calculateRatingForTeams(
            $teamAUsers, $teamBUsers, $gameResult
        );

        foreach ($teamAUsers as $user) {
            $gameUser = GameUser::create([
                'game_id' => $game->id,
                'user_id' => $user->id,
                'team_index' => $game::TEAM_A_INDEX,
                'rating_before' => $user->rating,
                'rating_after' => array_shift($teamARatings)
            ]);

            $user->rating = $gameUser->rating_after;

            if ($gameResult === GameProcessor::WIN)
                $user->count_wins++;
            elseif ($gameResult === GameProcessor::LOSE)
                $user->count_looses++;
            else
                $user->count_draws++;

            if (!$user->save()) {
                // do something...
            }
        }

        foreach ($teamBUsers as $user) {
            $gameUser = GameUser::create([
                'game_id' => $game->id,
                'user_id' => $user->id,
                'team_index' => $game::TEAM_B_INDEX,
                'rating_before' => $user->rating,
                'rating_after' => array_shift($teamBRatings)
            ]);

            if ($gameResult === GameProcessor::WIN)
                $user->count_looses++;
            elseif ($gameResult === GameProcessor::LOSE)
                $user->count_wins++;
            else
                $user->count_draws++;

            $user->rating = $gameUser->rating_after;

            if (!$user->save()) {
                // do something...
            }
        }
    }

    public static function updateGame(Game $game, array $data)
    {
        $oldTeamAPoints = isset($data['team_a_points']) ? (int) $data['team_a_points'] : 0;
        $oldTeamBPoints = isset($data['team_b_points']) ? (int) $data['team_b_points'] : 0;

        $game = $game->with(['gamesUsersA.user', 'gamesUsersB.user'])->first();

        foreach ($game->gamesUsersA as $gameUser) {
            $user = $gameUser->user;
            $user->rating = $gameUser->rating_before;

            if ($oldTeamAPoints > $oldTeamBPoints) {
                $user->count_wins--;
            } elseif ($oldTeamAPoints < $oldTeamBPoints) {
                $user->count_looses--;
            } else {
                $user->count_draws--;
            }

            $user->rating = $gameUser->rating_before;

            if (!$user->save()) {
                // do something...
            }
        }

        foreach ($game->gamesUsersB as $gameUser) {
            $user = $gameUser->user;
            $user->rating = $gameUser->rating_before;

            if ($oldTeamBPoints > $oldTeamAPoints) {
                $user->count_wins--;
            } elseif ($oldTeamBPoints < $oldTeamAPoints) {
                $user->count_looses--;
            } else {
                $user->count_draws--;
            }

            $user->rating = $gameUser->rating_before;

            if (!$user->save()) {
                // do something...
            }
        }
    }
}