<?php

use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class DeleteGameTest extends TestCase {

    use DatabaseTransactions;

    protected $users = [];
    protected $points;

    /** @test */
    public function regular_user_deletes_game() {
        $this->users = $this->create_users(4);
        $response = $this->authRegularUser()
            ->create_game_request(rand(0, 9))
            ->parseResponse();

        $this->delete_game_request($response->id)
            ->seeStatusCode(403)
            ->seeInDatabase('games', [
                'id' => $response->id
            ]);
    }

    /** @test */
    public function delete_non_existent_game() {
        $this->users = $this->create_users(4);

        $response = $this->authAdmin()
            ->create_game_request(rand(0, 9))
            ->parseResponse();

        $this->delete_game_request($response->id + 1)
            ->seeStatusCode(422)
            ->seeInDatabase('games', [
                'id' => $response->id
            ]);
    }

    /** @test */
    public function delete_game_with_api() {
        $this->users = $this->create_users(4);

        $response = $this->authAdmin()
            ->create_game_request(rand(0, 9))
            ->parseResponse();

        $this->delete_game_request($response->id)
            ->seeStatusCode(200)
            ->dontSeeInDatabase('games', [
                'id' => $response->id
            ]);
    }

    /**
     * @param $points
     * @return $this
     */
    public function create_game_request($points) {
        return $this->request('POST', '/api/games', [
            'games_users_a' => [
                $this->users[0]->id,
                $this->users[1]->id
            ],
            'team_a_points' => 10,
            'games_users_b' => [
                $this->users[2]->id,
                $this->users[3]->id
            ],
            'team_b_points' => $points,
            'played_at' => Carbon::now()->format('m/d/Y H:i')
        ]);
    }

    /**
     * @param int $id
     * @return self
     */
    public function delete_game_request($id) {
        return $this->request('DELETE', "/api/games/{$id}");
    }

    /**
     * @return stdClass
     */
    public function parseResponse() {
        /** @var \Illuminate\Http\Response $response */
        $response = $this->response;

        return json_decode($response->getContent());
    }
}
