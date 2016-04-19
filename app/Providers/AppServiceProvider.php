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

        // @TODO refactoring of validation rule
        Validator::extend('unique_compare_to', function($attribute, $value, $parameters, $validator) {
            $allData = $validator->getData();
            $compareTo = $parameters[0];
            $compareValue = $allData[$compareTo];

            if (is_array($value)) {
                for ($i = 0; $i < count($value); $i++) {
                    $currentValue = $value[$i];

                    for ($j = 0; $j< count($compareValue); $j++) {
                        if ($currentValue === $compareValue[$j]) {
                            return false;
                        }
                    }
                }
            }

            return true;
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
