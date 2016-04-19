<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    // Authentication routes...
    Route::get('/signin', 'Auth\AuthController@getLogin')->name('login');
    Route::post('/signin', 'Auth\AuthController@postLogin')->name('checkLogin');
    Route::get('/logout', 'Auth\AuthController@getLogout')->name('logout');

    Route::get('/fb/signin', 'Auth\AuthController@redirectToProvider')->name('fbRegister');
    Route::get('/fb/signin/callback', 'Auth\AuthController@handleProviderCallback')
        ->name('fbRegisterCheck');

    // Registration routes...
    Route::get('/signup', 'Auth\AuthController@getRegister')->name('register');
    Route::post('/signup', 'Auth\AuthController@postRegister')->name('checkRegister');

    // Games routes
    Route::get('/', 'GameController@getIndex')->name('home');

    Route::post('game/create', [
        'middleware' => [\App\Http\Middleware\PermissionRequired::class . ':user'],
        'uses' => 'GameController@postCreate'
    ])->name('createGameCheck');

    Route::get('game/{id}', 'GameController@getOne')
        ->where('id', '[0-9]+')->name('oneGame');
    
    Route::get('game/{id}/update', 'GameController@getUpdate')
        ->where('id', '[0-9]+')->name('updateGame');
    Route::post('game/{id}/update', 'GameController@postUpdate')
        ->where('id', '[0-9]+')->name('updateGameCheck');

    Route::get('game/{id}/delete', 'GameController@getDelete')
        ->where('id', '[0-9]+')->name('deleteGame');
    
    Route::get('game/{id}/complain', 'ComplaintController@create')
        ->where('id', '[0-9]+')->name('complain');

    // Users routes
    Route::get('/user/search', 'UserController@getSearch')->name('userSearch');
    Route::get('/user/role', 'UserController@getRole')->name('userRole');
    Route::get('/user/me', 'UserController@getOne');
    Route::get('/users', 'UserController@getIndex');

    // Users routes
    Route::get('/chart', 'ChartController@getIndex')->name('chart');
});
