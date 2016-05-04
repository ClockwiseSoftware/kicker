<!DOCTYPE html>
<html ng-app="kickerApp">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>@yield('title')</title>

        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

        {{-- Google gonts CDN --}}
        <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400italic,600,600italic,700,700italic,300italic,300' rel='stylesheet' type='text/css'>
        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link rel='stylesheet' href="https://apiary.a.ssl.fastly.net/assets/website-b64c00d70e7971fc4f7a.css">

        {{-- Font awesome CDN --}}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">

        {{ Html::style('css/main.css') }}
        @yield('styles')
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
                        <li><a href="/#/">Games</a></li>
                        <li><a href="/#/chart">Chart</a></li>
                        @if(!Auth::check())
                            <li><a href="/#/signin">Login</a></li>
                            <li><a href="/#/signup">Register</a></li>
                        @else
                            <li><a href="/#/game/create">Add game</a></li>
                            <li><a href="/#/user/profile">Profile</a></li>
                            <li><a href="/logout">Logout ({{ App\User::findMe()->email }})</a></li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container-fluid main-container">
            <div class="content">
                <div ng-view></div>
            </div>
        </div>

        {{ Html::script('js/vendors.js') }}
        {{ Html::script('js/app.js') }}
        @yield('scripts')
    </body>
</html>
