process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir');
require('laravel-elixir-html-minify');

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
    mix.less([
        'main.less',
        'navbar.less',
        'games.less',
        'chart.less',
        'edit-users.less'
    ], 'resources/assets/css/main.css', 'resources/assets/less');

    // Main assets
    mix.styles([
        'bower/bootstrap/dist/css/bootstrap.css',
        'bower/ui-select/dist/select.css',
        'bower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
        'bower/angular-bootstrap/ui-bootstrap-csp.css',

        'bower/angular/angular-csp.css',

        'css/sign.css',
        'css/main.css'
    ], 'public/css/main.css', 'resources/assets');

    mix.scripts([
        'bower/jquery/dist/jquery.js',
        'bower/bootstrap/dist/js/bootstrap.js',
        'bower/moment/min/moment.min.js',
        'bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',

        // Angular
        'bower/angular/angular.js',

        // Angular derivatives
        'resources/assets/bower/angular-route/angular-route.js',
        'resources/assets/bower/angular-sanitize/angular-sanitize.js',
        'resources/assets/bower/ui-select/dist/select.js',
        'resources/assets/bower/angular-bootstrap/ui-bootstrap.js',
        'resources/assets/bower/angular-bootstrap/ui-bootstrap-tpls.js',
        'resources/assets/bower/ng-file-upload/ng-file-upload.js'
    ], 'public/js/vendors.js', 'resources/assets');

    mix.copy('resources/assets/bower/bootstrap/fonts', 'public/fonts');

    // Angular application
    //mix.copy('resources/assets/app/views', 'public/html/views');
    mix.html('**/*.html', 'public/html/views', 'resources/assets/app/views');
    mix.scripts([
        'app.js',

        // Custom directive
        'directives/BackImgDirective.js',
        'directives/NumberOnlyDirective.js',

        // Chart
        'services/UserService.js',
        'controllers/ChartsCtrl.js',

        // Services
        'services/GameUserService.js',
        'services/GameService.js',
        'services/CreateGameService.js',
        'services/UserSearchService.js',

        // Controllers
        'controllers/GamesCtrl.js',
        'controllers/CreateGameCtrl.js',
        'controllers/UpdateGameCtrl.js',
        'controllers/ComplainersCtrl.js',
        'controllers/UsersEditCtrl.js',

        // Signup
        'services/AuthUserService.js',
        'controllers/SignupCtrl.js',

        // Signin
        'controllers/SigninCtrl.js'

    ], 'public/js/app.js', 'resources/assets/app');
});
