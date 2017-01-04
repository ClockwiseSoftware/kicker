<?php

namespace App\Http\Controllers;

use App\Http\Requests\GameRequests\DeleteGameRequest;
use App\Models\Complaint;
use App\Models\Game;
use App\Models\GameProcessor;
use App\User;
use Illuminate\Http\Request;

class GameController extends Controller
{
    const ACTION_CREATE = 'create';
    const ACTION_UPDATE = 'update';

    /**
     * @param string $action
     * @return array
     */
	protected function validationRules($action = self::ACTION_CREATE) {
		$rules = [
			'games_users_a' => 'required|users_ids:2|unique_compare_to:games_users_b',
//            'games_users_a' => 'required|integer',
			'team_a_points' =>
				"required|min:" . GameProcessor::POINTS_MIN . "|max:" . GameProcessor::POINTS_MAX . "|integer",
			'games_users_b' => 'required|users_ids:2|unique_compare_to:games_users_a',
			'team_b_points' =>
				"required|min:" . GameProcessor::POINTS_MIN . "|max:" . GameProcessor::POINTS_MAX . "|integer",
			'played_at'     => 'required|date'
		];

		// Additional validation rules for creating of a game.
		if ($action === self::ACTION_CREATE) {
			$rules['team_b_points'] .= '|game_unique:300';
		}

		return $rules;
	}

    public function index(Request $request)
    {   
        $req = $request->all();
        // \Log::info($req);

        $query = 
            Game
                ::where('status', Game::STATUS_ACTIVE)
                ->with([
                    'complaints.user', 
                    'gamesUsersA.user', 
                    'gamesUsersB.user'])
                ->orderBy('games.played_at', 'desc')
                ->orderBy('games.id', 'desc');

        $usersGames = (bool) $request->get('usersGames');
        $user = $request->user();

        if (isset($req["maxId"]) && $req["maxId"] > 0) {
            $query->where("games.id", ">", $req["maxId"]);
        }

        if ($usersGames && $user) {
            $query->forUser($user);
        }

        if ($request->wantsJson()) {
            return response($query->paginate(5));
        }

        return view('games.index', [
            'user' => $request->user()
        ]);
    }

    public function one(Request $request, $id)
    {
        $game = Game::with(['complaints.user', 'gamesUsersA.user', 'gamesUsersB.user'])
            ->where('id', $id)
            ->firstOrFail();

        return response($game);
    }

    public function create(Request $request)
    {
        $this->validate($request, $this->validationRules());
        $game = Game::create($request->all());

        if ($game)
            return response($game);

        return response($game, 400);
    }

    public function update(Request $request, $id)
    {
    	if (!$request->user()->isAdmin()) {
    		return response('Unauthorized', 401);
	    }
        $this->validate($request, $this->validationRules(self::ACTION_UPDATE));
        $game = Game::findOrFail($id);

        /* @var $game Game */
        if ($game->update($request->all()))
            return response($game);

        return response($game, 500);
    }

    public function delete(DeleteGameRequest $request)
    {
        /** @var Game $game */
        $game = Game::find((int) $request->get('id'));

        return $game->delete() ? response($game) : response('Something went wrong', 500);
    }
}