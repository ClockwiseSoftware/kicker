<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
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
}
