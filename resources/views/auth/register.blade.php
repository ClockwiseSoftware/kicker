@extends('layouts.sign')
@section('title', 'Kicker charts / Sign up')

@section('content')

    @if (count($errors) > 0)
        <div class="alert alert-danger sign-errors">
            @foreach ($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    <form class="form-sign" method="POST" action="/signup">
        <input type="hidden" name="_token" value="{{ csrf_token() }}">

        <h2 class="form-sign-heading">Please sign up</h2>
        <a href="#" class="sign-with">Sign up with Facebook</a>
        <div class="sign-choices">OR</div>

        <div class="form-inputs">
            <div class="form-group">
                <label for="inputName" class="sr-only">Name</label>
                <input type="text" id="inputName" class="form-control" name="name"
                       value="{{ old('name') }}" placeholder="Name" required autofocus>
            </div>
            <div class="form-group">
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control" name="email"
                       value="{{ old('email') }}" placeholder="Email address" required>
            </div>
            <div class="form-group">
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" name="password"
                       value="" placeholder="Password" required>
            </div>
        </div>

        <div class="sign-controls">
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
        </div>
    </form>
@stop