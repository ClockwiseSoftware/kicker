<?php

use App\Models\GameProcessor;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class GameProcessorTest extends TestCase
{
	use DatabaseTransactions;

	/**
	 * @test
	 */
	public function check_calculating_rating()
	{
		$users = [];
		$ratings = [
			1400, 1500, 1200, 1300,
		];

		foreach ($ratings as $index => $rating) {
			$users[] = factory(App\User::class)->create(['rating' => $ratings[$index]]);
		}

		$result = GameProcessor::calculateRatingForTeams(
			[$users[0], $users[1]], [$users[2], $users[3]], GameProcessor::WIN, 5
		);

		$this->assertEquals($result[0][0], 1406);
		$this->assertEquals($result[0][1], 1506);
		$this->assertEquals($result[1][0], 1194);
		$this->assertEquals($result[1][1], 1294);

	}
}
