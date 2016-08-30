<?php

use App\Models\Game;
use App\Models\GameProcessor;
use App\Models\GameUser;
use App\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ComplaintTest extends TestCase  {

	use DatabaseTransactions;

	/** @var  Game */
	protected $game;
	/** @var Collection  */
	protected $users = [];
	/** @var Collection  */
	protected $games = [];

	public function setUp() {
		parent::setUp();
	}

	/** @test */
	public function send_complaint_with_api() {
		$this->prepareGames();

		$reason = str_random(10);
		$response = $this->create_complaint_request($this->game->id, $reason);

		// check response has complaint data
		$response->seeJson([
			'game_id' => $this->game->id,
			'user_id' => $this->user->id,
			'reason'  => $reason
		])->seeJsonStructure([
			'id', 'game_id', 'user_id', 'reason'
		]);

		// check db for isset record about complaint
		$this->seeInDatabase('complaints', [
			'game_id' => $this->game->id,
			'user_id' => $this->user->id,
			'reason'  => $reason
		]);
	}

	/** @test */
	public function send_complaint_with_large_reason_api() {
		$this->prepareGames();
		$reason = str_random(300);
		$response = $this->create_complaint_request($this->game->id, $reason);
		$response
			->assertResponseStatus(422)
			->seeJson([
				'reason' => ['The reason may not be greater than 255 characters.']
			]);
	}

	/** @test */
	public function send_complaint_with_empty_reason_api() {
		$this->prepareGames();
		$response = $this->create_complaint_request($this->game->id, '');
		$response
			->assertResponseStatus(422)
			->seeJson([
				'reason' => ['The reason field is required.']
			]);
	}

	/** @test */
	public function send_complaint_with_null_reason_api() {
		$this->prepareGames();
		$response = $this->create_complaint_request($this->game->id, null);
		$response
			->assertResponseStatus(422)
			->seeJson([
				'reason' => ['The reason field is required.']
			]);
	}

	/** @test */
	public function delete_complaint_with_api() {
		$this->prepareGames();

		$reason = str_random(10);
		$this->create_complaint_request($this->game->id, $reason);
		$this->delete_complaint_request($this->game->id);

		$this->dontSeeInDatabase('complaints', [
			'game_id' => $this->game->id, 'user_id' => $this->user->id
		]);

	}

	public function prepareGames() {
		// create 3 random games
		$this->create_games(3);
		// choose random game
		$this->game = $this->games->random();
		// authenticate
		$this->auth();
	}

	public function create_complaint_request($game_id, $text) {
		// send complaint for rnd game
		return $this->request(
			'POST',
			'/api/games/' . $game_id . '/complain',
			[
				'reason' => $text
			]
		);
	}

	public function delete_complaint_request($game_id) {
		return $this->request(
			'DELETE',
			'/api/games/' . $game_id . '/complain'
		);
	}

	public function create_games($count) {
		$this->users = $this->create_users(4);

		$this->games = factory(Game::class, $count)->create();

		$rating = GameProcessor::calculateRatingForTeams(
			[$this->users[0], $this->users[1]], [$this->users[2], $this->users[3]], GameProcessor::WIN, rand(1,9)
		);

		foreach ($this->games as $game) {
			$this->create_game_user($game, $this->users[0], $rating[0][0],'a');
			$this->create_game_user($game, $this->users[1], $rating[0][1],'a');
			$this->create_game_user($game, $this->users[2], $rating[1][0],'b');
			$this->create_game_user($game, $this->users[3], $rating[1][1],'b');
		}
	}

	public function create_game_user($game, $user, $rating, $team) {
		$game_user = new GameUser([
			'user_id'    => $user->id,
			'game_id'    => $game->id,
			'team_index' => $team,
			'rating_before' => $user->rating,
			'rating_after' => $rating
		]);
		$game_user->save();
		$user->rating = $rating;
		$user->save();
	}

}
