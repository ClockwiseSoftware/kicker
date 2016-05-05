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
        'edit-users.less',
        'profile.less',
        'checkboxes.less',
        'theme.less'
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
        'resources/assets/bower/ng-file-upload/ng-file-upload.js',
        'resources/assets/bower/angular-resource/angular-resource.js',
        'resources/assets/bower/angular-animate/angular-animate.js'
    ], 'public/js/vendors.js', 'resources/assets');

    mix.copy('resources/assets/bower/bootstrap/fonts', 'public/fonts');

    // Angular application
    mix.html('**/*.html', 'public/html', 'resources/assets/app/html');
    mix.scripts([
        'app.js',

        // Custom directives
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

        // Resources
        'resources/Player.js',

        // Repositories
        'repositories/GamesRepository.js',

        // Controllers
        'controllers/GamesCtrl.js',
        'controllers/CreateGameCtrl.js',
        'controllers/UpdateGameCtrl.js',
        'controllers/ComplainersCtrl.js',
        'controllers/UsersEditCtrl.js',
        'controllers/UserProfileCtrl.js',

        // Signup
        'services/AuthUserService.js',
        'controllers/SignupCtrl.js',

        // Signin
        'controllers/SigninCtrl.js'

    ], 'public/js/app.js', 'resources/assets/app');
});
