<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Middleware\GetUserFromToken;

class JWTAdmin extends GetUserFromToken {
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Closure $next
	 * @return mixed
	 */
	public function handle($request, Closure $next) {
		if ($token = $this->auth->setRequest($request)->getToken()) {
			try {
				$user = $this->auth->authenticate($token);
			} catch (\Exception $e) {
				return response('Forbidden.', 403);
			}
			if (!$user->isAdmin()) {
				return response('Forbidden.', 403);
			}
		} else {
			return response('Forbidden.', 403);
		}

		return $next($request);
	}
}
