<?php

namespace App\Http\Controllers;

use App\User;

class ChartController extends Controller
{
    public function getIndex()
    {
        $users = User::orderBy('rating', SORT_DESC)->get();

        return view('chart.index', [
            'users' => $users
        ]);
    }
}