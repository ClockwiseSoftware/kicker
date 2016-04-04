<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    const TEAM_A_INDEX = 'a';
    const TEAM_B_INDEX = 'b';

    protected $table = 'games';
    protected $fillable = ['played_at', 'team_a_points', 'team_b_points'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gamesUsersA()
    {
        return $this->hasMany(GameUser::class)->where('team_index', static::TEAM_A_INDEX);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gamesUsersB()
    {
        return $this->hasMany(GameUser::class)->where('team_index', static::TEAM_B_INDEX);
    }

    public function usersA()
    {
        $users = [];
        foreach ($this->gamesUsersA as $gamesUsers) {
            $users[] = $gamesUsers->user;
        }

        return $users;
    }

    public function usersB()
    {
        $users = [];
        foreach ($this->gamesUsersB as $gamesUsers) {
            $users[] = $gamesUsers->user;
        }

        return $users;
    }

    /**
     * @return float|int
     */
    public function getGameResult()
    {
        if ($this->team_a_points > $this->team_b_points) {
            return GameProcessor::WIN;
        } elseif ($this->team_a_points < $this->team_b_points) {
            return GameProcessor::LOSE;
        } else {
            return GameProcessor::DRAW;
        }
    }

    /**
     * @param $value
     * @return $this
     */
    public function setPlayedAtAttribute($value)
    {
        $this->attributes['played_at'] = date('c', strtotime($value));
        return $this;
    }

    /**
     * @return bool|string
     */
    public function getPlayedAtAttribute()
    {
        return date('m/d/Y H:i', strtotime($this->attributes['played_at']));
    }
}