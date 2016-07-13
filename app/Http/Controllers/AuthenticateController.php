<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Requests;
use GuzzleHttp;
use App\User;
use JWTAuth;
use Config;
use Hash;

class AuthenticateController extends Controller
{
	public function __construct() {
        $this->middleware(
            'jwt.auth', 
            [   'except' => [   'authenticate', 
                                'fbCallback']]);
	}

    public function authenticate() {
      	$credentials = Input::only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if(!$token = JWTAuth::attempt($credentials))
                return response()
                            ->json(['error' => 'invalid_credentials'], 401);

        } 
        catch(JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
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
                ['query' => $params]);

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

        if(!array_key_exists('email', $profile))
                $profile['email'] = "";

        $user = 
            User::where('facebook_id', $profile['id'])
                    //->orWhere('email', $profile['email'])
                    ->first();

        // If user is already signed in then link accounts.
        if($user) {

            $user->facebook_id = $profile['id'];
            $user->email = $user->email ?: $profile['email'];
            $user->name = $user->name ?: $profile['name'];
            $user->avatar_url = 
                $user->avatar_url ?: $profile['picture']['data']['url'];
        }
        else {  // Create a new user account or return an existing one.

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
                        "password" => $user->password]);

        if($token)
            return response()->json(compact('token'));
        else
            return response()->json(['error' => 'something went wrong'], 500);
    }
}
