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
    Route::get('/signin', 'Auth\AuthController@getLogin');
    Route::post('/signin', 'Auth\AuthController@postLogin');
    Route::get('/logout', 'Auth\AuthController@getLogout');

    Route::get('/fb/signin', 'Auth\AuthController@redirectToProvider');
    Route::get('/fb/signin/callback', 'Auth\AuthController@handleProviderCallback');

    // Registration routes...
    Route::get('/signup', 'Auth\AuthController@getRegister');
    Route::post('/signup', 'Auth\AuthController@postRegister');

    // Games routes
    Route::get('/', 'GamesController@getIndex')->name('home');
    Route::get('game/create', 'GamesController@getCreate')->name('createGame');

    // Users routes
    Route::post('/user/search', 'UserController@postSearch')->name('userSearch');
});
