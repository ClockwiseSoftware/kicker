@extends('layouts.master')

@section('styles')
    <link href="{{ asset('bower/select2/dist/css/select2.min.css') }}" rel="stylesheet">
@stop
@section('scripts')
    <script src="{{ asset('bower/select2/dist/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('js/game.create.js') }}"></script>
@stop

@section('title', 'Add Game')

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2 create-game-container">
            {{ Form::open(['class' => 'form-horizontal']) }}
                <div class="team">
                    <div class="team-title">Team A</div>
                    <div class="form-group">
                        {{ Form::label('games_users', 'Players', ['class' => 'col-sm-2 control-label']) }}
                        <div class="col-sm-10">
                            {{ Form::select('games_users', [], null, ['class' => 'search-user col-md-12']) }}
                        </div>
                    </div>
                    <div class="form-group">
                        {{ Form::label('team_a_points', 'Points', ['class' => 'col-sm-2 control-label']) }}
                        <div class="col-sm-10">
                            {{ Form::number('team_a_points', 0, ['class' => 'form-control']) }}
                        </div>
                    </div>
                </div>
                <div class="team">
                    <div class="team-title">Team B</div>
                    <div class="form-group">
                        {{ Form::label('games_users', 'Players', ['class' => 'col-sm-2 control-label']) }}
                        <div class="col-sm-10">
                            {{ Form::select('games_users', [], null, ['class' => 'search-user col-md-12']) }}
                        </div>
                    </div>
                    <div class="form-group">
                        {{ Form::label('team_b_points', 'Points', ['class' => 'col-sm-2 control-label']) }}
                        <div class="col-sm-10">
                            {{ Form::number('team_b_points', 0, ['class' => 'form-control']) }}
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <button class="btn btn-primary" type="submit">Save</button>
                </div>
            {{ Form::close() }}
        </div>
    </div>
@stop