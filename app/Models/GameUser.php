<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\User;

class GameUser extends Model
{
    protected $table = 'games_users';
    protected $fillable = [
        'game_id', 'user_id', 'team_index',
        'rating_before', 'rating_after'
    ];

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

    /**
     * @return mixed
     */
    public function getDelta()
    {
        return $this->rating_after - $this->rating_before;
    }
}