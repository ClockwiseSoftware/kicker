<?php

namespace App\Http\Controllers;

use App\User;

class ChartController extends Controller
{
    public function index()
    {
        $users = User::playedGames()->active()->orderBy('rating', SORT_DESC)->get();

        return response($users);
    }
}
