<?php

namespace App\Http\Controllers;

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
    protected function validationRules($action = self::ACTION_CREATE)
    {
        $rules = [
            'games_users_a' => 'required|users_ids:2|unique_compare_to:games_users_b',
            'team_a_points' =>
                "required|min:" . GameProcessor::POINTS_MIN . "|max:" . GameProcessor::POINTS_MAX . "|integer",
            'games_users_b' => 'required|users_ids:2|unique_compare_to:games_users_a',
            'team_b_points' =>
                "required|min:" . GameProcessor::POINTS_MIN . "|max:" . GameProcessor::POINTS_MAX . "|integer",
            'played_at' => 'required|date'
        ];

        // Additional validation rules for creating of a game.
        if ($action === self::ACTION_CREATE) {
            $rules['team_b_points'] .= '|game_unique:300';
        }
        
        return $rules;
    }

    public function index(Request $request)
    {
        $games = Game::where('status', Game::STATUS_ACTIVE)
            ->with(['complaints.user', 'gamesUsersA.user', 'gamesUsersB.user'])
            ->orderBy('played_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(5);

        if ($request->wantsJson()) {
            return response($games);
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

        return response($game);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, $this->validationRules(self::ACTION_UPDATE));
        $game = Game::findOrFail($id);

        /* @var $game Game */
        $game->update($request->all());

        return response($game);
    }

    public function delete(Request $request, $id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return redirect()->route('home');
    }
}