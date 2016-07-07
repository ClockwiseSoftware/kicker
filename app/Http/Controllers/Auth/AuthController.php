<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => ['logout', 'getLogout']]);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:1',
        ]);
    }

    protected function sendFailedLoginResponse($request)
    {
        return response()->json([
            $this->loginUsername() => [$this->getFailedLoginMessage()]
        ], 422);
    }

    // public function postLogin(Request $request)
    // {
    //     $this->validateLogin($request);

    //     // If the class is using the ThrottlesLogins trait, we can automatically throttle
    //     // the login attempts for this application. We'll key this by the username and
    //     // the IP address of the client making these requests into this application.
    //     $throttles = $this->isUsingThrottlesLoginsTrait();

    //     if ($throttles && $lockedOut = $this->hasTooManyLoginAttempts($request)) {
    //         $this->fireLockoutEvent($request);

    //         //return response()->json(['msg' => "#1"]);
    //         return $this->sendLockoutResponse($request);
    //     }

    //     $credentials = $this->getCredentials($request);

    //     if (Auth::guard($this->getGuard())->attempt($credentials, $request->has('remember'))) {
    //         //return response()->json(['msg' => "#2"]);
    //         return $this->handleWasAuth($request, $throttles);
    //     }

    //     // If the login attempt was unsuccessful we will increment the number of attempts
    //     // to login and redirect the user back to the login form. Of course, when this
    //     // user surpasses their maximum number of attempts they will get locked out.
    //     if ($throttles && ! $lockedOut) {
    //         $this->incrementLoginAttempts($request);
    //     }

    //     //return response()->json(['msg' => "#0"]);

    //     return $this->sendFailedLoginResponse($request);

    //     // return redirect()->back()
    //     //     ->withInput($request->only($this->loginUsername(), 'remember'))
    //     //     ->withErrors([
    //     //         $this->loginUsername() => $this->getFailedLoginMessage(),
    //     //     ]);
    // }

    // protected function handleWasAuth($request, $throttles) {
    //     if ($throttles) {
    //         $this->clearLoginAttempts($request);
    //     }

    //     if (method_exists($this, 'authenticated')) {
    //         return $this->authenticated($request, Auth::guard($this->getGuard())->user());
    //     }

    //     //return response()->json(['msg' => redirect()->session]);
    //     return redirect()->intended($this->redirectPath());
    // }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
            'password' => bcrypt($data['password']),
        ]);
    }

    public function redirectToProvider()
    {
        return Socialite::with('facebook')->redirect();
    }

    public function handleProviderCallback()
    {
        $fbUser = Socialite::with('facebook')->user();

        if ($fbUser) {
            $fbUser->email = mb_strtolower($fbUser->email);
            
            $user = User::where('facebook_id', $fbUser->id)
                ->orWhere('email', $fbUser->email)
                ->first();

            if (!$user) {
                $user = new User();
                $user->facebook_id = $fbUser->id;
                $user->avatar_url = $fbUser->avatar;
                $user->email = $fbUser->email;
                $user->name = $fbUser->name;
                $user->password = bcrypt($user->generateTempPassword());

                $user->save();
            } elseif ($user->facebook_id === $fbUser->id) {
                //
            } elseif ($user->email === $fbUser->email) {
                $user->facebook_id = $fbUser->id;
                $user->avatar_url = $fbUser->avatar;
                $user->save();
            }

            Auth::login($user, true);
        }

        return redirect()->route('home');
    }
}