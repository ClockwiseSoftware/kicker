<?php

namespace App\Http\Controllers;

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
            'games_users_a' => 'required',
            'team_a_points' => 'required|integer|min:0',
            'games_users_b' => 'required',
            'team_b_points' => 'required|integer|min:0',
            'played_at' => 'required|date',
        ];
    }

    public function getIndex(Request $request)
    {
        return view('games.index', [
            'user' => $request->user(),
            'games' => Game::with(['gamesUsersA.user', 'gamesUsersB.user'])
                ->orderBy('played_at', 'desc')
                ->orderBy('id', 'desc')->paginate()
        ]);
    }

    public function getCreate(Request $request)
    {
        $usersA = $usersB = [];

        if ($usersAIds = old('games_users_a')) {
            $usersA = User::whereIn('id', $usersAIds)->get();
        }
        if ($usersBIds = old('games_users_b')) {
            $usersB = User::whereIn('id', $usersBIds)->get();
        }

        return view('games.create', [
            'usersA' => $usersA,
            'usersB' => $usersB,
        ]);
    }

    public function postCreate(Request $request)
    {
        $this->validate($request, $this->validationRules());

        $game = new Game();
        $game->fill($request->all());

        if ($game->save()) {
            $usersATeam = User::whereIn('id', $request->get('games_users_a'))->get();
            $usersBTeam = User::whereIn('id', $request->get('games_users_b'))->get();

            GameProcessor::addUsersToGame($game, $usersATeam, $usersBTeam);
        }

        return redirect('/');
    }

    public function getUpdate(Request $request, $id)
    {
        $game = Game::where(['id' => $id])->with(['gamesUsersA.user', 'gamesUsersB.user'])->first();

        if (!$game)
            abort(404);

        if ($usersAIds = old('games_users_a')) {
            $usersA = User::whereIn('id', $usersAIds)->get();
        } else {
            $usersA = $game->usersA();
        }

        if ($usersBIds = old('games_users_b')) {
            $usersB = User::whereIn('id', $usersBIds)->get();
        } else {
            $usersB = $game->usersB();
        }

        return view('games.update', [
            'usersA' => $usersA,
            'usersB' => $usersB,
            'game' => $game
        ]);
    }

    public function postUpdate(Request $request, $id)
    {
        $this->validate($request, $this->validationRules());
        $game = Game::where('id', $id)->first();

        if (!$game)
            abort(404);

        $game->fill($request->all());

        if ($game->save()) {
            $usersATeam = User::whereIn('id', $request->get('games_users_a'))->get();
            $usersBTeam = User::whereIn('id', $request->get('games_users_b'))->get();

            GameProcessor::addUsersToGame($game, $usersATeam, $usersBTeam);
        }

        return redirect('/');
    }
}