<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreComplaintRequest;
use App\Models\Complaint;
use App\Models\Game;
use App\User;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
	/**
	 * @param StoreComplaintRequest $request
	 * @param $game_id
	 * @return \Illuminate\Contracts\Routing\ResponseFactory
	 */
	public function create(StoreComplaintRequest $request, $game_id)
    {

        $user = User::findMe();
        $complaint = Complaint::player($user->id)
            ->getGame((int)$game_id)
	        ->first();

        if (count($complaint) > 0) {
            return response($complaint, 409);
        } else {
        	$reason = $request->input('reason');

	        try {
		        $complaint = Complaint::create([
			        'user_id' => $user->id,
			        'game_id' => $game_id,
			        'reason'  => $reason
		        ]);
	        } catch (\Exception $e) {
	        	return response()->json(['error' => ['Saving error']], 400);
	        }

	        return response($complaint, 201);
        }

    }

	/**
	 * @param $game_id
	 * @return \Illuminate\Contracts\Routing\ResponseFactory
	 */
	public function delete($game_id) {
		$user = User::findMe();
		$complaint = Complaint::where('user_id', $user->id)
			->where('game_id', (int) $game_id)
			->take(1)
			->first();

		if ($complaint) {
			$complaint->delete();
		}

		return response(['status' => 'ok'], 200);
    }
}