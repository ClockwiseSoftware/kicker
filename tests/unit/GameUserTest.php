<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class GameUserTest extends TestCase {
	use DatabaseTransactions;
	/**
	 * @test
	 */
	public function game_user_has_user() {
		$this->assertTrue(true);
	}

	/**
	 * @test
	 */
	public function game_user_has_game() {
		$this->assertTrue(true);
	}

	/**
	 * @test
	 */
	public function check_delta() {
		$this->assertTrue(true);
	}

}
