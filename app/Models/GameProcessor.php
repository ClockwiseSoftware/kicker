<?php

namespace App\Models;

class GameProcessor
{
    const NEW_BEE_MATCHES_EDGE = 30;

    const WIN = 1;
    const LOSE = 0;
    const DRAW = 0.5;

    const TEAM_A = 0;
    const TEAM_B = 1;

    const POINTS_FOR_NEW_BEE = 40;
    const POINTS_FOR_MEDIUM = 20;
    const POINTS_FOR_PRO = 10;

    protected function newRating($ratingA, $ratingB, $matchResult, $matchesCount)
    {
        $e = 1 / (1 + pow(10, ($ratingB - $ratingA) / 400));

        if ($matchesCount <= static::NEW_BEE_MATCHES_EDGE)
            $k = static::POINTS_FOR_NEW_BEE;
        elseif ($ratingA >= 2400)
            $k = static::POINTS_FOR_PRO;
        else
            $k = static::POINTS_FOR_MEDIUM;

        return $ratingA + $k * ($matchResult - $e);
    }

    protected function teamRating($users)
    {
        $result = 0;

        foreach ($users as $user) {
            $result += (int) $user->rating;
        }

        return $result / count($users);
    }

    protected function gamesPlayed($users)
    {
        $gamesPlayed = 0;

        foreach ($users as $user) {
            $gamesPlayed += $user->getCountGames();
        }

        return $gamesPlayed;
    }

    protected function newUsersRating($users, $oldTeamRating, $newTeamRating)
    {
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
}