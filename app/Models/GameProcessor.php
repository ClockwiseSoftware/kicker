<?php

namespace App\Models;

use Psy\Exception\ErrorException;

class GameProcessor
{
    const WIN = 1;
    const LOSE = 0;
    const DRAW = 0.5;

    const BASE_POINTS = 1;

    const TEAM_A = 0;
    const TEAM_B = 1;

    const DEFAULT_RATING = 1200;

    const POINTS_MIN = 0;
    const POINTS_MAX = 10;

    protected function countDelta($ratingWinner, $ratingLoser, $pointsDelta)
    {
        $e = 1 / (1 + pow(10, ($ratingLoser - $ratingWinner) / 400));

        return (int) (static::BASE_POINTS * $pointsDelta / $e);
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

    protected function newUsersRating($users, $oldTeamRating, $newTeamRating)
    {
        if (count($users) === 0)
            throw new ErrorException('No users has been provided');

        $result = [];
        $ratingDelta = ($newTeamRating - $oldTeamRating);

        foreach ($users as $user) {
            $result[] = (int) ($user->rating + $ratingDelta);
        }

        return $result;
    }

    public static function calculateRatingForTeams($teamA, $teamB, $result, $pointsDelta)
    {
        $newRatings = [];
        $processor = new static();

        if ($result === static::WIN) {
            $winnerTeam = $teamA;
            $loserTeam = $teamB;
            $winnerTeamIndex = static::TEAM_A;
            $loserTeamIndex = static::TEAM_B;
        } else {
            $loserTeam = $teamA;
            $winnerTeam = $teamB;
            $winnerTeamIndex = static::TEAM_B;
            $loserTeamIndex = static::TEAM_A;
        }
        $teamsRatings = [
            static::TEAM_A => $processor->teamRating($teamA),
            static::TEAM_B => $processor->teamRating($teamB)
        ];
        $pointsPerMatch = $processor->countDelta(
            $teamsRatings[$winnerTeamIndex], $teamsRatings[$loserTeamIndex], $pointsDelta
        );

        foreach ($loserTeam as $item) {
            $newRatings[$loserTeamIndex][] = $item->rating - $pointsPerMatch;
        }
        foreach ($winnerTeam as $item) {
            $newRatings[$winnerTeamIndex][] = $item->rating + $pointsPerMatch;
        }

        return $newRatings;
    }

    public static function oppositeResult($gameResult)
    {
        if ($gameResult === static::WIN)
            return static::LOSE;
        else if ($gameResult === static::LOSE)
            return static::WIN;

        return static::DRAW;
    }
}