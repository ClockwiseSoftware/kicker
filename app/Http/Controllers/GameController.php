<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Game;
use App\Models\GameProcessor;
use App\User;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * @return array
     */
    protected function validationRules()
    {
        return [
            'games_users_a' => 'required|users_ids:2|unique_compare_to:games_users_b',
            'team_a_points' => 
                "required|min:" . GameProcessor::POINTS_MIN . "|max:" . GameProcessor::POINTS_MAX . "|integer",
            'games_users_b' => 'required|users_ids:2|unique_compare_to:games_users_a',
            'team_b_points' => 
                "required|min:" . GameProcessor::POINTS_MIN . "|max:" . GameProcessor::POINTS_MAX . "|integer",
            'played_at' => 'required|date',
        ];
    }

    public function getIndex(Request $request)
    {
        $games = Game::with(['complaints.user', 'gamesUsersA.user', 'gamesUsersB.user'])
            ->orderBy('played_at', 'desc')
            ->orderBy('id', 'desc')->paginate(5);

        if ($request->wantsJson()) {
            return response($games);
        }

        return view('games.index', [
            'user' => $request->user()
        ]);
    }

    public function getOne(Request $request, $id)
    {
        $game = Game::with(['complaints.user', 'gamesUsersA.user', 'gamesUsersB.user'])
            ->where('id', $id)
            ->orderBy('played_at', 'desc')
            ->firstOrFail();

        return response($game);
    }

    public function postCreate(Request $request)
    {
        $this->validate($request, $this->validationRules());
        Game::create($request->all());
    }

    public function postUpdate(Request $request, $id)
    {
        $this->validate($request, $this->validationRules());
        $game = Game::where('id', $id)->first();

        if (!$game)
            abort(404);

        /* @var $game Game */
        $game->updateWith($request->all());
        Complaint::where('game_id', $game->id)->delete();

        return redirect('/');
    }

    public function getDelete(Request $request, $id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return redirect()->route('home');
    }
}