<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class JWTAuthTest extends TestCase
{
	use DatabaseTransactions;
	
	/** @test */
	public function jwt_auth_with_api_return_token() {

		$this->auth();

		$this->seeJson()->seeJsonStructure(['token']);

	}

	public function jwt_signup_return() {
		
	}

	/** @test */
	public function not_auth_user_dont_see_list() {
		$this->request('GET', '/api/users');
		$this->assertResponseStatus(400);
		$this->seeJson(['error' => 'token_not_provided']);
	}

	/** @test */
	public function users_list_api() {
		$this->auth();

		$this->request('GET', '/api/users');
		$this
			->seeJson()
			->seeJsonStructure(['total', 'data']);
	}

	/** @test */
	public function users_list_not_contain_deleted_users() {
		$this->auth();
		$user = factory(User::class)->create(['deleted' => 1]);
		$this->request('GET', '/api/users');
		$this
			->seeJson()
			->seeJsonStructure(['total', 'data'])
			->dontSeeJson(['id' => $user->id])
			->seeInDatabase('users', ['id' => $user->id]);
	}
}
