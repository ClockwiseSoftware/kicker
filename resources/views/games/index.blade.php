@extends('layouts.master')

@section('title', 'Page Title')
@section('content')
    @foreach ($games as $game)
    <div class="row">
        <div class="col-md-8 col-md-offset-2 col-sm-12 game-container">
            <div class="game-graphic">
                <div class="team team-a">
                    @foreach ($game->gamesUsersA as $gameUser)
                    <div class="team-user">
                        <div class="info">
                            <div>{{ $gameUser->user->name }}</div>
                            <div>{{ $gameUser->getDelta() }}</div>
                            <div>{{ $gameUser->rating_after }}</div>
                        </div>
                        <div class="user-avatar">
                            <img src="{{ $gameUser->user->getAvatarUrl() }}" />
                        </div>
                    </div>
                    @endforeach
                </div>
                <div class="result-container">
                    <div class="versus">VS</div>
                    <div class="result">
                        <div class="point">5</div>
                        <div class="point">:</div>
                        <div class="point win">12</div>
                    </div>
                </div>
                <div class="team team-b">
                    @foreach ($game->gamesUsersB as $gameUser)
                    <div class="team-user">
                        <div class="user-avatar">
                            <img src="{{ $gameUser->user->getAvatarUrl() }}" />
                        </div>
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
                @if (Auth::check())
                <div class="controls">
                    <a class="btn btn-default btn-xs control-button"><i class="fa fa-pencil"></i></a>
                    <a class="btn btn-danger btn-xs control-button"><i class="fa fa-flag"></i></a>
                    <a class="btn btn-danger btn-xs control-button"><i class="fa fa-ban"></i></a>
                </div>
                @endif
                <div class="game-name">Game #{{ $game->id }}</div>
                <div>Played at: {{ $game->created_at }}</div>
            </div>
        </div>
    </div>
    @endforeach
@stop