<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class ChartController extends Controller
{
    public function getIndex(Request $request)
    {
        if ($request->wantsJson()) {
            $users = User::orderBy('rating', SORT_DESC)->get();
            return response()->json($users);
        }

        return view('chart.index');
    }
}