<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\User;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function create(Request $request, $gameId, $msg)
    {
        $user = User::findMe();
        $complaint = Complaint::where('user_id', $user->id)
            ->where('game_id', (int) $gameId)
            ->take(1)
            ->first();

        if ($complaint) {
            $complaint->delete();
        } else {
            Complaint::create([
                'user_id' => $user->id,
                'game_id' => $gameId,
                'reason' => $msg
            ]);
        }

        //return redirect('/');
    }
}