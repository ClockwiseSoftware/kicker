<?php

namespace App\Http\Middleware;

use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Routing\Middleware;
use Illuminate\Contracts\Routing\ResponseFactory;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class JWTSoftAuth
{
    public function __construct(
        ResponseFactory $response, 
        Dispatcher $events, 
        JWTAuth $auth)
    {
        $this->response = $response;
        $this->events = $events;
        $this->auth = $auth;
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {

        if($token = $this->auth->setRequest($request)->getToken()) {
            try {
                $user = $this->auth->authenticate($token);
            } 
            catch(TokenExpiredException $e) {
                return $this->respond(
                            'tymon.jwt.expired', 
                            'token_expired', 
                            $e->getStatusCode(), 
                            [$e]);
            } 
            catch(JWTException $e) {
                return $this->respond(
                            'tymon.jwt.invalid', 
                            'token_invalid', 
                            $e->getStatusCode(), 
                            [$e]);
            }

            if(! $user) {
                return $this->respond(
                            'tymon.jwt.user_not_found', 
                            'user_not_found', 
                            404);
            }

            $this->events->fire('tymon.jwt.valid', $user);
        }

        return $next($request);
    }

    public function respond($event, $error, $status, $payload = [])
    {
        $response = $this->events->fire($event, $payload, true);

        return $response ?: $this->response->json(['error' => $error], $status);
    }
}
