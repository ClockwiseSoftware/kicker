<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\User;
use Illuminate\Http\Request;

class GameController extends Controller
{
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
        $this->validate($request, [
            'games_users_a' => 'required',
            'team_a_points' => 'required|integer|min:0',
            'games_users_b' => 'required',
            'team_b_points' => 'required|integer|min:0',
            'played_at' => 'required|date',
        ]);

        $game = new Game();
        $game->played_at = $request->get('played_at');
        $game->team_a_points = $request->get('team_a_points');
        $game->team_b_points = $request->get('team_b_points');

        if ($game->save()) {
            $usersATeam = User::whereIn('id', $request->get('games_users_a'))->get();
            $usersBTeam = User::whereIn('id', $request->get('games_users_b'))->get();

            $game->addUsers($usersATeam, $usersBTeam);
        }

        return redirect('/');
    }

    public function getUpdate(Request $request, $id)
    {
        $usersA = $usersB = [];
        $game = Game::where(['id' => $id])->with(['gamesUsersA.user', 'gamesUsersB.user'])->first();

        if (!$game)
            abort(404);

        if ($usersAIds = old('games_users_a')) {
            $usersA = User::whereIn('id', $usersAIds)->get();
        } else {
            foreach ($game->gamesUsersA as $gamesUsers) {
                $usersA[] = $gamesUsers->user;
            }
        }
        if ($usersBIds = old('games_users_b')) {
            $usersB = User::whereIn('id', $usersBIds)->get();
        } else {
            foreach ($game->gamesUsersB as $gamesUsers) {
                $usersB[] = $gamesUsers->user;
            }
        }

        return view('games.update', [
            'usersA' => $usersA,
            'usersB' => $usersB,
            'game' => $game
        ]);
    }

    public function postUpdate(Request $request, $id)
    {
        $this->validate($request, [
            'games_users_a' => 'required',
            'team_a_points' => 'required|integer|min:0',
            'games_users_b' => 'required',
            'team_b_points' => 'required|integer|min:0',
            'played_at' => 'required|date',
        ]);

        $game = Game::where('id', $id)->first();

        if (!$game)
            abort(404);

        $game->played_at = $request->get('played_at');
        $game->team_a_points = $request->get('team_a_points');
        $game->team_b_points = $request->get('team_b_points');

        if ($game->save()) {
            $usersATeam = User::whereIn('id', $request->get('games_users_a'))->get();
            $usersBTeam = User::whereIn('id', $request->get('games_users_b'))->get();

            $game->addUsers($usersATeam, $usersBTeam);
        }

        return redirect('/');
    }
}