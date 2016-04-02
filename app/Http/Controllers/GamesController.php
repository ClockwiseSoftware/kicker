<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GamesController extends Controller
{
    public function getIndex(Request $request)
    {
        return view('games.index', [
            'user' => $request->user(),
            'games' => Game::with(['gamesUsersA.user', 'gamesUsersB.user'])->get()
        ]);
    }

    public function getCreate(Request $request)
    {
        return view('games.create');
    }
}