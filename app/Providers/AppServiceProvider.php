<?php

namespace App\Providers;

use App\Models\Game;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('users_ids', function ($attribute, $value, $parameters, $validator) {
            $usersIdsCount = isset($parameters[0]) ? (int)$parameters[0] : 2;

            if (!is_array($value))
                return false;

            $ids = [];

            foreach ($value as $item) {
                $item = (int)$item;

                if (!$item)
                    return false;

                $ids[] = (int)$item;
            }

            if (count($ids) !== $usersIdsCount)
                return false;

            $usersCount = (int)User::whereIn('id', $ids)->count();

            return $usersCount === $usersIdsCount;
        });

        // @TODO refactoring of validation rule
        Validator::extend('unique_compare_to', function ($attribute, $value, $parameters, $validator) {
            $allData = $validator->getData();
            $compareTo = $parameters[0];
            $compareValue = $allData[$compareTo];

            if (is_array($value)) {
                for ($i = 0; $i < count($value); $i++) {
                    $currentValue = $value[$i];

                    for ($j = 0; $j < count($compareValue); $j++) {
                        if ($currentValue === $compareValue[$j]) {
                            return false;
                        }
                    }
                }
            }

            return true;
        });

        // @TODO refactoring of validation rule
        Validator::extend('game_unique', function ($attribute, $value, $parameters, $validator) {
            $data = $validator->getData();

            $secondsDelta = (int)$parameters[0];

            $usersAIds = $data['games_users_a'];
            $usersBIds = $data['games_users_b'];
            $teamAPoints = (int)$data['team_a_points'];
            $teamBPoints = (int)$data['team_b_points'];

            $games = Game::where(
                function ($query) use ($teamAPoints, $teamBPoints) {
                    // ... WHERE (
                    //     (`team_a_points` = "$teamAPoints" AND `team_b_points` = "$teamBPoints")
                    //     OR
                    //     (`team_a_points` = "$teamBPoints" AND `team_b_points` = "$teamAPoints")
                    // ) ...
                    return $query->where(function ($query) use ($teamAPoints, $teamBPoints) {
                        return $query->where('team_a_points', $teamAPoints)
                            ->where('team_b_points', $teamBPoints);
                    })->orWhere(function ($query) use ($teamAPoints, $teamBPoints) {
                        return $query->where('team_a_points', $teamBPoints)
                            ->where('team_b_points', $teamAPoints);
                    });
                })
                ->where(
                    'created_at', '>=', Carbon::now()->subSeconds($secondsDelta)
                )->with(['gamesUsersA', 'gamesUsersB'])
                ->get();

            foreach ($games as $game) {
                $gamesUsersA = $game->gamesUsersA;
                $gamesUsersB = $game->gamesUsersB;

                $usersAIdsOld = $gamesUsersA->pluck('user_id')->all();
                $usersBIdsOld = $gamesUsersB->pluck('user_id')->all();

                // If game points and players are the same validation will not be passed.
                if ($game->team_a_points == $teamAPoints && $game->team_b_points == $teamBPoints) {
                    if (empty(array_diff($usersAIds, $usersAIdsOld)) && empty(array_diff($usersBIds, $usersBIdsOld))) {
                        return false;
                    }
                } else if ($game->team_a_points == $teamBPoints && $game->team_b_points == $teamAPoints) {
                    if (empty(array_diff($usersAIds, $usersBIdsOld)) && empty(array_diff($usersBIds, $usersAIdsOld))) {
                        return false;
                    }
                }
            }

            return true;
        });

        Validator::extend('old_password', function ($attribute, $value, $parameters) {
            return Hash::check($value, $parameters[0]);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
	    if($this->app->environment() !== 'production') {
		    $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
	    }
	    //
    }
}
