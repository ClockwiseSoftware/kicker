<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class JWTAuthTest extends TestCase
{
	/**
	 * @test
	 */
	public function auth() {

		parent::auth();

		$this->seeJson()->seeJsonStructure(['token']);

	}
}
