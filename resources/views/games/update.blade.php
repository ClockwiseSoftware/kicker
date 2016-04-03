@extends('layouts.master')

@section('styles')
    <link href="{{ asset('bower/select2/dist/css/select2.min.css') }}" rel="stylesheet">
    <link rel="stylesheet"
          href="{{ asset('bower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css') }}" />
@stop
@section('scripts')
    <script src="{{ asset('bower/select2/dist/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('bower/moment/min/moment.min.js') }}"></script>
    <script src="{{ asset('bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js') }}"></script>
    <script src="{{ asset('js/game.create.js') }}"></script>
@stop

@section('title', "Update Game #{$game->id}")
@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2 create-game-container">

            <h2 class="text-center">Game #{{ $game->id }}</h2>

            {{ Form::open([
                'class' => 'form-horizontal',
                'url' => route('updateGameCheck', ['id' => $game->id])]
            ) }}
            <div class="team">
                <div class="team-title">Team A</div>
                <div class="form-group">
                    {{ Form::label('games_users_a[]', 'Players', [
                        'class' => 'col-sm-2 control-label'
                    ]) }}
                    <div class="col-sm-10">
                        <select class="search-user col-md-12" name="games_users_a[]"
                                multiple="multiple" required="required">
                            @foreach ($usersA as $user)
                                <option value="{{ $user->id }}"
                                        selected="selected">#{{ $user->id }} {{ $user->name }}</option>
                            @endforeach
                        </select>
                        <div class="error">{{ $errors->first('games_users_a') }}</div>
                    </div>
                </div>

                <div class="form-group">
                    {{ Form::label('team_a_points', 'Points', ['class' => 'col-sm-2 control-label']) }}
                    <div class="col-sm-10">
                        {{ Form::number('team_a_points', old('team_a_points', $game->team_a_points), [
                            'class' => 'form-control',
                            'min' => 0,
                            'required' => 'required'
                        ]) }}
                        <div class="error">{{ $errors->first('team_a_points') }}</div>
                    </div>
                </div>
            </div>

            <div class="team">
                <div class="team-title">Team B</div>
                <div class="form-group">
                    {{ Form::label('games_users_b[]', 'Players', ['class' => 'col-sm-2 control-label']) }}
                    <div class="col-sm-10">
                        <select class="search-user col-md-12" name="games_users_b[]"
                                required="required" multiple="multiple">
                            @foreach ($usersB as $user)
                                <option value="{{ $user->id }}"
                                        selected="selected">#{{ $user->id }} {{ $user->name }}</option>
                            @endforeach
                        </select>
                        <div class="error">{{ $errors->first('games_users_b') }}</div>
                    </div>
                </div>

                <div class="form-group">
                    {{ Form::label('team_b_points', 'Points', ['class' => 'col-sm-2 control-label']) }}
                    <div class="col-sm-10">
                        {{ Form::number('team_b_points', old('team_b_points', $game->team_b_points), [
                            'class' => 'form-control',
                            'min' => 0,
                            'required' => 'required'
                        ]) }}
                        <div class="error">{{ $errors->first('team_b_points') }}</div>
                    </div>
                </div>
            </div>

            <div class="team">
                <hr>
                <div class="form-group">
                    {{ Form::label('played_at', 'Date', ['class' => 'col-sm-2 control-label']) }}
                    <div class="col-sm-10">
                        {{ Form::text('played_at', old('played_at', $game->played_at), [
                            'class' => 'form-control',
                            'id' => 'played-at',
                            'required' => 'required'
                        ]) }}
                        <div class="error">{{ $errors->first('played_at') }}</div>
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