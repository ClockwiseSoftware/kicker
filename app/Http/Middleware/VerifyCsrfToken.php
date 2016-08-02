<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

class VerifyCsrfToken extends BaseVerifier
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        //
    ];

	public function handle($request, Closure $next, $guard = null) {

		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Credentials: true');
		header("Access-Control-Allow-Methods: GET,PUT,DELETE,POST,OPTIONS");
		header('Access-Control-Allow-Headers: Origin, Content-Type,x-access-token,Authorization');

		return $next($request);
	}
}
