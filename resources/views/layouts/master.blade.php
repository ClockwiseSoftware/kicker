<!DOCTYPE html>
<html>
    <head>
        <title>@yield('title')</title>

        <link rel="shortcut icon" href="/favicon.ico" type="image/png">

        <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400italic,600,600italic,700,700italic,300italic,300' rel='stylesheet' type='text/css'>
        <link rel='stylesheet' href="https://apiary.a.ssl.fastly.net/assets/website-b64c00d70e7971fc4f7a.css">

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="{{ asset('bower/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link href="{{ asset('css/main.css') }}" rel="stylesheet">
        @yield('styles')

        <script src="{{ asset('bower/jquery/dist/jquery.min.js') }}"></script>
        <script src="{{ asset('bower/bootstrap/dist/js/bootstrap.min.js') }}"></script>
        @yield('scripts')
    </head>
    <body>
        <nav class="navbar navbar-default navbar-fixed-top navbar-center">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-6" aria-expanded="false"><span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                    </button>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-6">
                    <ul class="nav navbar-nav navbar-center">
                        <li><a href="/">Games</a></li>
                        @if(!Auth::check())
                            <li><a href="/signin">Sign In</a></li>
                            <li><a href="/signup">Sign Up</a></li>
                        @else
                            <li><a href="{{ route('createGame') }}">Add game</a></li>
                            <li><a href="/logout">Logout</a></li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container main-container">
            <div class="content">
                @yield('content')
            </div>
        </div>
    </body>
</html>
