@extends('layouts.master')

@section('title', 'Page Title')

@section('styles')
    <link href="{{ asset('css/sign.css') }}" rel="stylesheet">
@stop

@section('content')
    <form class="form-signin">
        <h2 class="form-signin-heading">Please sign in</h2>
        <a href="#" class="sign-with">Sign in with Facebook</a>
        <div class="sign-choices">OR</div>

        <label for="inputName" class="sr-only">Name</label>
        <input type="text" id="inputName" class="form-control" placeholder="Name" required>

        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>

        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>

        <div class="sign-controls">
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </div>
    </form>
@stop