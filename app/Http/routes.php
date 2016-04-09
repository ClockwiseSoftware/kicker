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

    Route::get('game/create', 'GameController@getCreate')->name('createGame');
    Route::post('game/create', 'GameController@postCreate')->name('createGameCheck');

    Route::get('game/update/{id}', 'GameController@getUpdate')
        ->where('id', '[0-9]+')->name('updateGame');
    Route::post('game/update/{id}', 'GameController@postUpdate')
        ->where('id', '[0-9]+')->name('updateGameCheck');

    Route::get('game/delete/{id}', 'GameController@getDelete')
        ->where('id', '[0-9]+')->name('deleteGame');

    // Users routes
    Route::post('/user/search', 'UserController@postSearch')->name('userSearch');

    // Users routes
    Route::get('/chart', 'ChartController@getIndex')->name('chart');
});
