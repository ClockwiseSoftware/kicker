<?php

namespace App\Http\Middleware;

use Closure;

class PermissionRequired
{
    public $permissions = [];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, ...$roles)
    {
        $user = $request->user();
        $hasPermission = false;

        foreach ($roles as $role) {
            if ((!$user && $role === 'guest') || ($user && $user->hasRole($role))) {
                $hasPermission = true;
                break;
            }
        }

        if ($hasPermission)
            return $next($request);

        return response(['Permission denied'], 401);
    }
}
