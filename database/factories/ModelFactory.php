<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

use Carbon\Carbon;

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'password' => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
        'is_admin' => (int)$faker->boolean(),
    ];
});

$factory->define(App\Models\Game::class, function (Faker\Generator $faker) {
	return [
		'played_at' => Carbon::now()->format('m/d/Y H:i'),
		'team_a_points' => 10 ,
		'team_b_points' => rand(0,9),
		'status' => 1,
	];
});