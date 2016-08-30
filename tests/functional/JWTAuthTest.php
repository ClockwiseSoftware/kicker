<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class JWTAuthTest extends TestCase {
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

	/** @test */
	public function check_user_info_witout_auth_api() {
		$this->request('GET', '/api/users/me');
		$this->assertResponseStatus(400);
		$this->seeJson(['error' => 'token_not_provided']);
	}

	/** @test */
	public function check_user_info_api() {
		$user = $this->auth();
		$this->request('GET', '/api/users/me');
//		$this->seeJson([
//			'id'      => $user->id,
//			'name'    => $user->name,
//			'rating'  => $user->rating,
//		]);
	}

	/** @test */
	public function check_user_role_witout_auth_api() {
		$this->request('GET', '/api/users/role');
		$this->assertResponseStatus(400);
		$this->seeJson(['error' => 'token_not_provided']);
	}

	/** @test */
	public function check_user_admin_role_api() {
		$this->auth(['is_admin' => 1]);
		$this->request('GET', '/api/users/role');
		$this->see('admin');
	}
	/** @test */
	public function check_user_role_api() {
		$this->auth(['is_admin' => 0]);
		$this->request('GET', '/api/users/role');
		$this->see('user');
	}


}
