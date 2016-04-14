<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function postSearch(Request $request)
    {
        $search = $request->get('search');
        $exceptIds = $request->get('exceptIds');

        $users = [];

        if ($search) {
            $query = User::where(function ($query) use ($search) {
                $query = $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");

                return $query;
            });

            if ($exceptIds)
                $query = $query->whereNotIn('id', $exceptIds);

            $users = $query->get();
        }

        return response()->json($users);
    }

    public function getRole(Request $request)
    {
        $user = $request->user();
        $role = User::ROLE_GUEST;

        if ($user) {
            $role = $user->isAdmin() ? User::ROLE_ADMIN : User::ROLE_USER;
        }

        return response()->json('user');
    }
}