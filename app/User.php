<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    protected static $user;
    public $defaults = [
        'rating' => 1200,
        'count_wins' => 0,
        'count_draws' => 0,
        'count_looses' => 0,
        'avatar_url' => null,
    ];

    public function __construct(array $attributes = [])
    {
        foreach ($this->defaults as $attr => $value) {
            if (!isset($attributes[$attr]))
                $attributes[$attr] = $value;
        }

        parent::__construct($attributes);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
        'count_wins', 'count_draws', 'count_looses',
        'rating', 'avatar_url'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function generateTempPassword($length = 32)
    {
        $password = '';

        $range = range('a', 'z');
        $range = array_merge(range(1, 9), $range);

        for ($i = 0; $i < $length; $i++) {
            $index = rand(0, $length - 1);
            $password .= $range[$index];
        }

        return $password;
    }

    /**
     * @return int
     */
    public function getCountGames()
    {
        return
            (int) $this->count_wins + (int) $this->count_draws + (int) $this->count_looses;
    }

    public function getAvatarUrl()
    {
        if ($this->avatar_url)
            return $this->avatar_url;

        return '/img/no-avatar.min.png';
    }

    public static function findMe()
    {
        if (!static::$user) {
            static::$user = Auth::user();
        }

        return static::$user;
    }

    public function isAdmin()
    {
        return (bool) $this->is_admin;
    }

    public function getFirstGameId()
    {
        $game = DB::table('games')
            ->select('games.id')
            ->join('games_users', 'games.id', '=', 'games_users.game_id')
            ->where(['user_id' => (int) $this->id])
            ->orderBy('games.played_at', 'asc')
            ->take(1)
            ->first();

        return isset($game->id) ? (int) $game->id : false;
    }
}