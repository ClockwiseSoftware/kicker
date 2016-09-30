<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Requests;
use GuzzleHttp;
use Tymon\JWTAuth\Exceptions\JWTException;
use Validator;
use App\User;
use JWTAuth;
use Config;
use Hash;

class AuthenticateController extends Controller
{
	public function __construct() {
		$this->middleware(
			'jwt.auth',
			[
				'except' =>
				 [
				 	'signup',
					 'authenticate',
					 'fbCallback'
				 ]
			]
		);
	}

    public function index() {

        $token = JWTAuth::getToken();
        $user = JWTAuth::toUser($token);

        return response()->json([
           'data' => [
               'email' => $user->email,
               'registered_at' => $user->created_at->toDateTimeString()
           ]
        ]);

        //return response()->json(["cntrl.index"], 500);
    }

    public function authenticate(SignInRequest $request) {
        try {
            // verify the credentials and create a token for the user
            if(!$token = JWTAuth::attempt($request->all())) {
                return response()
	                ->json(['error' => ['Invalid credentials']], 401);
            }

        }
        catch(JWTException $e) {
            // something went wrong
            return response()
	            ->json(['error' => ['Could not create token']], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    public function signup(SignUpRequest $request) {
        //create new user
        $user = new User();
        $user->name = $request->input("name");
        $user->email = $request->input("email");
        $user->setPassword($request->input("password"));
        $user->save();

        //make token
        try {
            if(!$token = JWTAuth::attempt($request->all())) {
	            return response()
		            ->json(['error' => ['Invalid credentials']], 401);
            }
        }
        catch(JWTException $e) {
            return response()
	            ->json(['error' => ['Could not create token']], 500);
        }

        //return jwt token
        return response()->json(compact('token'));
    }

    public function fbCallback(Request $request) {

        $client = new GuzzleHttp\Client();
        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'redirect_uri' => $request->input('redirectUri'),
            'client_secret' => Config::get('app.facebook_secret')
        ];

        // Exchange authorization code for access token.
        $accessTokenResponse =
            $client->request(
                'GET',
                'https://graph.facebook.com/v2.5/oauth/access_token',
                ['query' => $params]
            );

        $accessToken = json_decode($accessTokenResponse->getBody(), true);

        // Retrieve profile information about the current user.
        $profileResponse =
            $client
                ->request(
                    'GET',
                    'https://graph.facebook.com/v2.5/me',
                    [   'query' => [
                            'access_token' => $accessToken['access_token'],
                            'fields' => 'id,name,email,picture']]);

        $profile = json_decode($profileResponse->getBody(), true);
        \Log::info($profile);
        if(!isset($profile['id']))
            return response()->json(
                        ['error' => 'Facebook ID not returned'],
                        500);

        if(!array_key_exists('email', $profile))
                $profile['email'] = sha1($profile['id']);

        $user = User::where('facebook_id', $profile['id'])->first();

        // If user is already signed in then link accounts.
        if($user) {
            $user->facebook_id = $profile['id'];
            $user->email = $user->email ?: $profile['email'];
            $user->name = $user->name ?: $profile['name'];
            $user->avatar_url =
                $user->avatar_url ?: $profile['picture']['data']['url'];
        } else {
        	// Create a new user account or return an existing one.
            $user = new User();
            $user->facebook_id = $profile['id'];
            $user->email = $profile['email'];
            $user->name = $profile['name'];
            $user->avatar_url = $profile['picture']['data']['url'];
        }

        $user->password = bcrypt($user->generateTempPassword());
        $user->save();

        $token =
                JWTAuth::fromUser(
                    $user,
                    [   "facebook_id" => $profile['id'],
                        "email" => $profile['email'],
                        "password" => $user->password
                    ]
                );

        if($token)
            return response()->json(compact('token'));
        else
            return response()->json(['error' => ['Something went wrong']], 500);
    }
}
