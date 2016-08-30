<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class JWTAuthTest extends TestCase {
	use DatabaseTransactions;

	/** @test */
	public function jwt_auth_with_api_return_token() {

		$password = str_random(10);
		$user = factory(User::class)->create(['password'=> bcrypt($password)]);

		$response = $this->request('POST','/api/auth',[
			'email' => $user->email,
			'password' => $password
		], false);

		$response
			->seeJson()
			->seeJsonStructure(['token']);

	}

	public function jwt_signup_return() {

	}

	/** @test */
	public function not_auth_user_dont_see_list() {
		$response = $this->request('GET', '/api/users', [], false);
		$response
			->assertResponseStatus(400)
			->seeJson(['error' => 'token_not_provided']);
	}

	/** @test */
	public function users_list_api() {
		$this->auth();
		$response = $this->request('GET', '/api/users');
		$response
			->seeJson()
			->seeJsonStructure(['total', 'data']);
	}

	/** @test */
	public function users_list_not_contain_deleted_users() {
		$this->auth();
		$user = factory(User::class)->create(['deleted' => 1]);
		$response = $this->request('GET', '/api/users');
		$response
			->seeJson()
			->seeJsonStructure(['total', 'data'])
			->dontSeeJson(['id' => $user->id])
			->seeInDatabase('users', ['id' => $user->id]);
	}

	/** @test */
	public function check_user_info_witout_auth_api() {
		$response = $this->request('GET', '/api/users/me', [], false);
		$response->assertResponseStatus(400);
		$response->seeJson(['error' => 'token_not_provided']);
	}

	/** @test */
	public function check_user_info_api() {
		$this->auth();
		$response = $this->request(
			'GET',
			'/api/users/me'
		);

		$response
			->seeJsonStructure([
				'id', 'name', 'rating'
			]);
	}

	/** @test */
	public function check_user_role_witout_auth_api() {
		$this->request('GET', '/api/users/role', [], false);
		$this->assertResponseStatus(400);
		$this->seeJson(['error' => 'token_not_provided']);
	}

	/** @test */
	public function check_user_admin_role_api() {
		$this->auth();

		$this->user->is_admin = 1;
		$this->user->save();

		$this->request('GET', '/api/users/role');
		$this->see('admin');
	}
	/** @test */
	public function check_user_role_api() {
		$this->auth();

		$this->user->is_admin = 0;
		$this->user->save();

		$this->request('GET', '/api/users/role');
		$this->see('user');
	}


}
