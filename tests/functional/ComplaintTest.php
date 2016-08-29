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
		$this->request('GET', '/');
		$this->seeJson()->seeJsonStructure(['total', 'data']);
		$this->assertTrue($this->response_json['total'] > 0);

		$id = rand(0, $this->response_json['total'] - 1);
		$this->game = $this->response_json['data'][$id];

		$this->auth();

		$this->request(
			'POST',
			'/api/game/' . $this->game['id'] . '/complain',
			[
				'reason' => 'asdasdas ad adas'
			]
		);

		$this->seeJson([
			'game_id' => $this->game['id'], 'user_id' => 1
		])->seeJsonStructure([
			'id', 'game_id', 'user_id', 'reason'
		]);

		$this->seeInDatabase('complaints', [
			'game_id' => $this->game['id'], 'user_id' => 1
		]);

		$this->delete_complaint();
	}

	public function delete_complaint() {

		$this->request(
			'DELETE',
			'/api/game/' . $this->game['id'] . '/complain'
		);

		$this->dontSeeInDatabase('complaints', [
			'game_id' => $this->game['id'], 'user_id' => 1
		]);
	}
}
