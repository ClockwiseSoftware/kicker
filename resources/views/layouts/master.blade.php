<!DOCTYPE html>
<html>
    <head>
        <title>@yield('title')</title>

        <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400italic,600,600italic,700,700italic,300italic,300' rel='stylesheet' type='text/css'><link rel='stylesheet' href="https://apiary.a.ssl.fastly.net/assets/website-b64c00d70e7971fc4f7a.css">

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="{{ asset('bower/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        @yield('styles')

        <script src="{{ asset('bower/jquery/dist/jquery.min.js') }}"></script>
        <script src="{{ asset('bower/bootstrap/dist/js/bootstrap.min.js') }}"></script>
        @yield('scripts')
    </head>
    <body>
        <div class="container">
            <div class="content">
                @yield('content')
            </div>
        </div>
    </body>
</html>
