process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    // Main assets
    mix.styles([
        'bower/bootstrap/dist/css/bootstrap.css',
        'css/main.css',
        'resources/assets/bower/angular/angular-csp.css'
    ], 'public/css/main.css', 'resources/assets');

    mix.scripts([
        'bower/jquery/dist/jquery.js',
        'bower/bootstrap/dist/js/bootstrap.js',
        'bower/angular/angular.js'
    ], 'public/js/vendors.js', 'resources/assets');

    mix.copy('resources/assets/bower/bootstrap/fonts', 'public/fonts');

    // Angular application
    mix.scripts([
        'app.js',
        'services/UserService.js',
        'controllers/ChartsCtrl.js'
    ], 'public/js/app.js', 'resources/assets/app');

    // Create game assets
    mix.scripts([
        'bower/select2/dist/js/select2.full.min.js',
        'bower/moment/min/moment.min.js',
        'bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
        'js/game.create.js'
    ], 'public/js/game.js', 'resources/assets');

    mix.styles([
        'bower/select2/dist/css/select2.min.css',
        'bower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
    ], 'public/css/game.css', 'resources/assets');

    // Sign-up and Sign-in
    mix.styles([
        'css/sign.css'
    ], 'public/css/sign.css', 'resources/assets');
});
