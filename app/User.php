<?php

namespace App;

use App\Models\GameProcessor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\FacadesDB;

class User extends Authenticatable
{
    const ROLE_GUEST = 'guest';
    const ROLE_USER = 'user';
    const ROLE_ADMIN = 'admin';

    const GAMES_PLAYED_EDGE = 3;

    protected static $user;

    public $defaults = [
        'rating' => GameProcessor::DEFAULT_RATING,
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

    public function scopeActive(Builder $query)
    {
        return $query->where('deleted', false);
    }

    public function softDelete()
    {
        $this->deleted = true;
        $this->deleteAvatar();

        return $this->save();
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
        'password', 'remember_token', 'email',
        'facebook_id', 'is_admin'
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

    /**
     * @param $password
     */
    public function setPassword($password)
    {
        $this->password = bcrypt($password);
    }

    /**
     * @param $password
     * @return bool
     */
    public function checkPassword($password)
    {
        return $this->password === bcrypt($password);
    }

    public function getAvatarUrl()
    {
        if ($this->avatar_url)
            return $this->avatar_url;

        return '/img/no-avatar.min.png';
    }

    public function changeStats($gameResult)
    {
        if ($gameResult === GameProcessor::WIN) {
            $this->count_wins++;
        } elseif ($gameResult === GameProcessor::LOSE) {
            $this->count_looses++;
        } elseif ($gameResult === GameProcessor::DRAW) {
            $this->count_draws++;
        }

        return $this;
    }

    public function rollbackStats($gameResult)
    {
        if ($gameResult === GameProcessor::WIN) {
            $this->count_wins--;
        } elseif ($gameResult === GameProcessor::LOSE) {
            $this->count_looses--;
        } elseif ($gameResult === GameProcessor::DRAW) {
            $this->count_draws--;
        }

        return $this;
    }

    public function deleteAvatar()
    {
        $fullPath = public_path() . $this->avatar_url;

        if ($this->avatar_url && file_exists($fullPath)) {
            unlink(public_path() . $this->avatar_url);
        }

        $this->avatar_url = null;

        return true;
    }
    
    public function setAvatar($avatarUrl = null)
    {
        $this->avatar_url = '/uploads/' . $avatarUrl;
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

    public function hasRole($role)
    {
        if ($role === 'admin')
            return $this->isAdmin();
        elseif ($role === 'user')
            return true;

        return false;
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

    public function scopePlayedGames($query)
    {
        $gamesPlayedEdge = static::GAMES_PLAYED_EDGE;

        return $query->groupBy('users.id')
            ->havingRaw("SUM(users.count_wins + users.count_looses + users.count_draws) >= {$gamesPlayedEdge}");
    }

    public static function updateStat()
    {
        // @TODO refactor raw query with db builder
        return DB::statement(
            "UPDATE `users` as u1 LEFT JOIN 
(SELECT g_u.`user_id`,
	COUNT(
		IF(
			(
				(g_u.`team_index` = 'a' AND (g.`team_a_points` > g.`team_b_points`))
				OR
				(g_u.`team_index` = 'b' AND (g.`team_a_points` < g.`team_b_points`))
			), 1, NULL)
	) as count_wins,
	COUNT(
		IF(
			(
				(g_u.`team_index` = 'a' AND (g.`team_a_points` < g.`team_b_points`))
				OR
				(g_u.`team_index` = 'b' AND (g.`team_a_points` > g.`team_b_points`))
			), 1, NULL)
	) as count_loses,
	COUNT(
		IF((g.`team_a_points` = g.`team_b_points`), 1, NULL)
	) as count_draws
FROM `games_users` as g_u 
INNER JOIN `games` as g ON g_u.`game_id` = g.id
INNER JOIN `users` as u ON g_u.`user_id` = u.id
GROUP BY g_u.`user_id`) as result

ON u1.`id` = result.`user_id`

SET u1.`count_wins` = result.count_wins, u1.`count_looses` = result.count_loses, u1.`count_draws` = result.count_draws");
    }
}
