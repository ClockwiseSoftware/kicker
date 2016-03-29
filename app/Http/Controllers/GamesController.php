<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GamesController extends Controller
{
    public function getIndex(Request $request)
    {
        return view('games.index', [
            'user' => $request->user()
        ]);
    }
}