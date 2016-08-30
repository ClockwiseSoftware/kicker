<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class JWTAuthTest extends TestCase
{
	use DatabaseTransactions;
	/**
	 * @test
	 */
	public function jwt_auth_with_api_return_token() {

		parent::auth();

		$this->seeJson()->seeJsonStructure(['token']);

	}
}
