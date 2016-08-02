<?php

namespace App\Http\Middleware;

use Closure;

class AddCorsHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
    	$response = $next($request);

	    header('Access-Control-Allow-Origin: *');
	    header('Access-Control-Allow-Credentials: true');
	    header("Access-Control-Allow-Methods: GET,PUT,DELETE,POST,OPTIONS");
	    header('Access-Control-Allow-Headers: Origin, Content-Type,x-access-token,Authorization');

	    return $response;
    }
}
