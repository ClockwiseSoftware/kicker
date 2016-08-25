<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Complaint extends Model
{
    protected $table = 'complaints';
    protected $fillable = ['game_id', 'user_id', 'reason'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function game()
    {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

	public function scopeGetGame($query, $game_id) {
		return $query->where('game_id', $game_id);
    }

    public function scopePlayer($query, $user_id) {
    	return $query->where('user_id', $user_id);
    }
}