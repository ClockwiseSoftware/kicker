<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use \App\Models\GameProcessor;

class ExampleTest extends TestCase
{
    /**
     * A basic functional test example.
     *
     * @return void
     */
    public function testBasicExample()
    {
        $users = [];
        $ratings = [
            1400, 1500, 1200, 1300,
        ];

        for ($i = 0; $i < 4; $i++) {
            $user = factory(App\User::class)->create();
            $user->rating = $ratings[$i];
            $users[] = $user;
        }

        $res = GameProcessor::calculateRatingForTeams(
            [$users[0], $users[1]], [$users[2], $users[3]], GameProcessor::WIN, 5
        );

        print_r($ratings);
        print_r($res);
    }
}
