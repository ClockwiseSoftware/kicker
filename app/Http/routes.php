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

//routes for jwt-applications
Route::group(["middleware" => ["api"], "prefix" => "api"], function() {

    Route::resource(
        '/index',
        'AuthenticateController', 
        ['only' => ['index']]);

    Route::post(
        '/auth',
        'AuthenticateController@authenticate');

    Route::post(
        '/signup',
        'AuthenticateController@signup');

    Route::post(
        '/fb/signin',
        'AuthenticateController@fbCallback');

    //restricted routes
    Route::group(
        ["middleware" => ["jwt.auth"]],
        function() {
            Route::get(
                '/users',
                'UserController@index');

            Route::get(
                '/user/me',
                'UserController@one');

            Route::get(
                '/user/role',
                'UserController@role');            

            Route::put(
                '/user/{id}',
                'UserController@update')
                    ->where('id', '[0-9]+');

            Route::delete(
                '/user/{id}',
                'UserController@delete')
                    ->where('id', '[0-9]+');

            Route::post(
                '/user/{id}/restore',
                'UserController@restore');

            Route::post(
                '/user/{id}/avatar',
                'UserController@updateAvatar')
                    ->where('id', '[0-9]+');

            Route::put(
                '/game/{id}',
                'GameController@update')
                    ->where('id', '[0-9]+');

            Route::delete(
                '/game/{id}',
                'GameController@delete')
                    ->where('id', '[0-9]+');

            Route::get(
                '/game/{id}/delete',
                'GameController@delete')
                    ->where('id', '[0-9]+');

            Route::post(
                '/game/{game_id}/complain',
                'ComplaintController@create')
                    ->where('game_id', '[0-9]+');

	        Route::delete(
                '/game/{game_id}/complain',
                'ComplaintController@delete')
                    ->where('game_id', '[0-9]+');

            Route::post(
                '/game',
                'GameController@create');

            Route::get(
                '/game/{id}',
                'GameController@one')
                    ->where('id', '[0-9]+');

            Route::get(
                '/games',
                'GameController@index')
                    ->name('home');
        });
});


Route::group(['middleware' => ['web']], function () {

    Route::get('/user/search', 'UserController@search');

    // Games routes
    Route::get('/', 'GameController@index')->name('home');

    // Chart routes
    Route::get('/chart', 'ChartController@index')->name('chart');
});
