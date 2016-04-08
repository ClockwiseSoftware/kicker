@extends('layouts.master')

@section('title', 'Games')
@section('content')
    @foreach ($games as $game)
    <div class="row games-container">
        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12 game-container">
            <div class="game-graphic">
                <div class="team team-a">
                    @foreach ($game->gamesUsersA as $gameUser)
                    <div class="team-user">
                        <div class="info">
                            <div class="name">{{ $gameUser->user->name }}</div>
                            <div class="rating-delta {{ userPointsClass($gameUser->getDelta()) }}">
                                {{ $gameUser->getDelta() }} points
                            </div>
                            <div>{{ $gameUser->rating_before }} <i class="fa fa-long-arrow-right"></i>
                                {{ $gameUser->rating_after }}</div>
                        </div>
                        <div class="user-avatar">
                            <img src="{{ $gameUser->user->getAvatarUrl() }}" />
                            <div class="stat">
                                <span class="wins">{{
                                    $gameUser->user->count_wins
                                }}</span>/<span class="loses">{{
                                    $gameUser->user->count_looses
                                }}</span>/<span class="draws">{{
                                    $gameUser->user->count_draws
                                }}</span>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                <div class="result-container">
                    <div class="versus">VS</div>
                    <div class="result">
                        <div class="point {{
                            gamePointClass($game->team_a_points, $game->team_b_points)
                        }}">{{ $game->team_a_points }}</div>
                        <div class="point">:</div>
                        <div class="point {{
                            gamePointClass($game->team_b_points, $game->team_a_points)
                        }}">{{ $game->team_b_points }}</div>
                    </div>
                </div>
                <div class="team team-b">
                    @foreach ($game->gamesUsersB as $gameUser)
                    <div class="team-user">
                        <div class="user-avatar">
                            <img src="{{ $gameUser->user->getAvatarUrl() }}" />
                            <div class="stat">
                                <span class="wins">{{
                                    $gameUser->user->count_wins
                                }}</span>/<span class="loses">{{
                                    $gameUser->user->count_looses
                                }}</span>/<span class="draws">{{
                                    $gameUser->user->count_draws
                                }}</span>
                            </div>
                        </div>
                        <div class="info">
                            <div class="name">{{ $gameUser->user->name }}</div>
                            <div class="rating-delta {{ userPointsClass($gameUser->getDelta()) }}">
                                {{ $gameUser->getDelta() }} points
                            </div>
                            <div>{{ $gameUser->rating_before }} <i class="fa fa-long-arrow-right"></i>
                                {{ $gameUser->rating_after }}</div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            <div class="game-information">
                @if (Auth::check())
                <div class="controls">
                    <a href="{{ route('updateGame', ['id' => $game->id]) }}" class="btn btn-default btn-xs control-button"><i class="fa fa-pencil"></i></a>
                    {{--<a class="btn btn-danger btn-xs control-button"><i class="fa fa-flag"></i></a>--}}
                    {{--<a class="btn btn-danger btn-xs control-button"><i class="fa fa-ban"></i></a>--}}
                </div>
                @endif
                <div>Played at: {{ $game->getPlayedAt() }}</div>
            </div>
        </div>
    </div>
    @endforeach
    <div class="row games-pages">
        {!! $games->render() !!}
    </div>
@stop