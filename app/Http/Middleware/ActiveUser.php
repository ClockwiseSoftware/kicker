<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class ActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $user = Auth::guard($guard)->user();

        if ($user->deleted) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('Forbidden. User is not active!', 403);
            } else {
                return redirect()->guest('login');
            }
        }

        return $next($request);
    }
}
