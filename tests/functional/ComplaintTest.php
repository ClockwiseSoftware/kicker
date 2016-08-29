<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ComplaintTest extends TestCase  {

	use DatabaseTransactions;

	protected $game;

	/**
	 * @test
	 */
	public function check_complaint() {
		if ($this->check_games()) {
			// get rnd game
			$this->rndGame();

			// authenticate
			$this->auth();

			$this->create_complaint();

			// check response has complaint data
			$this->seeJson([
				'game_id' => $this->game['id'], 'user_id' => 1
			])->seeJsonStructure([
				'id', 'game_id', 'user_id', 'reason'
			]);

			// check db for isset record about complaint
			$this->seeInDatabase('complaints', [
				'game_id' => $this->game['id'], 'user_id' => 1
			]);
		}

	}

	/**
	 * @test
	 */
	public function delete_complaint() {
		if ($this->check_games()) {
			$this->rndGame();

			// authenticate
			$this->auth();

			$this->create_complaint();

			$this->request(
				'DELETE',
				'/api/game/' . $this->game['id'] . '/complain'
			);

			$this->dontSeeInDatabase('complaints', [
				'game_id' => $this->game['id'], 'user_id' => 1
			]);
		}
	}

	public function rndGame() {
		// db has more that 0 games
		$this->assertTrue($this->response_json['total'] > 0);
		// get rnd game for send complaint
		$id = rand(0, $this->response_json['total'] - 1);
		// save rnd game
		$this->game = $this->response_json['data'][$id];
	}

	public function create_complaint() {
		// send complaint for rnd game
		$this->request(
			'POST',
			'/api/game/' . $this->game['id'] . '/complain',
			[
				'reason' => 'asdasdas ad adas'
			]
		);
	}

	public function check_games() {
		$this->request('GET', '/');
		$this->seeJson()->seeJsonStructure(['total', 'data']);

		return (bool)$this->response_json['total'];
	}

}
