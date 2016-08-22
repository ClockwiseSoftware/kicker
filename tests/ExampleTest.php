<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use \App\Models\GameProcessor;

class ExampleTest extends TestCase
{
	/**
	 * @test
	 */
	public function true_test() {
		$this->assertTrue(true);
	}
}
