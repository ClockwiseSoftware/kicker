<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class ChartController extends Controller
{
    public function getIndex(Request $request)
    {
        $users = User::playedGames()->orderBy('rating', SORT_DESC)->get();

        return response($users);
    }
}