@extends('layouts.master')

@section('title', 'Page Title')
@section('content')
    @foreach ($games as $game)
    <div class="row">
        <div class="col-md-8 game-container">
            <div class="game-graphic">
                <div class="team team-a">
                    @foreach ($game->gamesUsersA as $gameUser)
                    <div class="team-user">
                        <div class="info">
                            <div>{{ $gameUser->user->name }}</div>
                            <div>{{ $gameUser->getDelta() }}</div>
                            <div>{{ $gameUser->rating_after }}</div>
                        </div>
                        <div class="user-avatar"></div>
                    </div>
                    @endforeach
                </div>
                <div class="result-container">
                    <div class="versus">VS</div>
                    <div class="result">
                        <div class="point">5</div>
                        <div class="point">:</div>git
                        <div class="point win">12</div>
                    </div>
                </div>
                <div class="team team-b">
                    @foreach ($game->gamesUsersB as $gameUser)
                    <div class="team-user">
                        <div class="user-avatar"></div>
                        <div class="info">
                            <div>{{ $gameUser->user->name }}</div>
                            <div>{{ $gameUser->getDelta() }}</div>
                            <div>{{ $gameUser->rating_after }}</div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            <div class="game-information">
                <div>Game #{{ $game->id }}</div>
                <div>Played at {{ $game->created_at }}</div>
            </div>
        </div>
    </div>
    @endforeach
@stop