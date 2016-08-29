<?php

use App\Models\Game;
use App\Models\GameProcessor;
use App\Models\GameUser;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ComplaintTest extends TestCase  {

	use DatabaseTransactions;

	protected $game;
	protected $users = [];

	public function setUp() {
		parent::setUp();
		$this->create_games(3);
	}

	/**
	 * @test
	 */
	public function send_complaint_with_api() {
		$this->check_games();
		// get rnd game
		$this->rndGame();

		// authenticate
		$this->auth();

		$this->create_complaint_request();

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

	/**
	 * @test
	 */
	public function delete_complaint_with_api() {
		$this->check_games();

		$this->rndGame();

		// authenticate
		$this->auth();

		$this->create_complaint_request();

		$this->request(
			'DELETE',
			'/api/game/' . $this->game['id'] . '/complain'
		);

		$this->dontSeeInDatabase('complaints', [
			'game_id' => $this->game['id'], 'user_id' => 1
		]);

	}

	public function rndGame() {
		// db has more that 0 games
		$this->assertTrue($this->response_json['total'] > 0);
		// get rnd game for send complaint
		$id = rand(0, $this->response_json['total'] - 1);
		// save rnd game
		$this->game = $this->response_json['data'][$id];
	}

	public function create_complaint_request() {
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

	public function create_games($count) {
		$this->users = $this->create_users(4);

		$games = factory(Game::class, $count)->create();

		$rating = GameProcessor::calculateRatingForTeams(
			[$this->users[0], $this->users[1]], [$this->users[2], $this->users[3]], GameProcessor::WIN, rand(1,9)
		);

		foreach ($games as $game) {
			$this->create_game_user($game, $this->users[0], $rating[0][0]);
			$this->create_game_user($game, $this->users[1], $rating[0][1]);
			$this->create_game_user($game, $this->users[2], $rating[1][0]);
			$this->create_game_user($game, $this->users[3], $rating[1][1]);
		}
	}

	public function create_game_user($game, $user, $rating) {
		$game_user = new GameUser([
			'user_id'    => $user->id,
			'game_id'    => $game->id,
			'team_index' => 'a',
			'rating_before' => $user->rating,
			'rating_after' => $rating
		]);
		$game_user->save();
		$user->rating = $rating;
		$user->save();
	}

}
