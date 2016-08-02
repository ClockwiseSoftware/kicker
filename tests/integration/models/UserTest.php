<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserTest extends TestCase
{
	use DatabaseTransactions;

	/**
     * @test
     */
    public function new_user_has_default_rating()
    {
        $users = factory(User::class, 3)->create();
	    foreach ($users as $user) {
	    	$this->assertEquals($user->rating,1200);
	    }
    }
}
