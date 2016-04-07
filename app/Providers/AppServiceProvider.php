<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('users_ids', function($attribute, $value, $parameters, $validator) {
            $usersIdsCount = isset($parameters[0]) ? (int) $parameters[0] : 2;

            if (!is_array($value))
                return false;

            $ids = [];

            foreach ($value as $item) {
                $item = (int) $item;

                if (!$item)
                    return false;

                $ids[] = (int) $item;
            }

            if (count($ids) !== $usersIdsCount)
                return false;

            $usersCount = (int) User::whereIn('id', $ids)->count();

            return $usersCount === $usersIdsCount;
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
