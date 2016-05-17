process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir');

require('laravel-elixir-html-minify');
require('laravel-elixir-clear');

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

elixir(function (mix) {
  mix.less([
    'main.less',
    'navbar.less',
    'sign.less',
    'games.less',
    'create-game.less',
    'chart.less',
    'edit-users.less',
    'profile.less',
    'checkboxes.less',
    'theme.less'
  ], 'resources/assets/css/compiled-less.css', 'resources/assets/less');

  // Main assets
  mix.styles([
    'resources/assets/bower/bootstrap/dist/css/bootstrap.min.css',
    'resources/assets/bower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
    'resources/assets/bower/angular-bootstrap/ui-bootstrap-csp.css',

    'resources/assets/bower/ng-dialog/css/ngDialog.min.css',
    'resources/assets/bower/ng-dialog/css/ngDialog-theme-default.min.css',

    'resources/assets/bower/angular-material/angular-material.min.css',
    'resources/assets/bower/angular/angular-csp.css',

    'resources/assets/css/compiled-less.css'
  ], 'public/css/main.css', './');

  mix.copy('resources/assets/bower/bootstrap/fonts', 'public/fonts');
  mix.copy('resources/assets/img', 'public/img');

  // Angular application
  mix.html('**/*.html', 'public/html', 'resources/assets/app/html');
  mix.scripts([
    'bower/jquery/dist/jquery.min.js',
    'bower/bootstrap/dist/js/bootstrap.min.js',
    'bower/moment/min/moment.min.js',
    'bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
    'bower/underscore/underscore-min.js',

    // Angular
    'bower/angular/angular.min.js',

    // Angular derivatives
    'bower/angular-route/angular-route.min.js',
    'bower/angular-sanitize/angular-sanitize.min.js',
    'bower/angular-bootstrap/ui-bootstrap.min.js',
    'bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower/ng-file-upload/ng-file-upload.min.js',
    'bower/angular-resource/angular-resource.min.js',
    'bower/angular-animate/angular-animate.min.js',
    'bower/ng-dialog/js/ngDialog.min.js',
    'bower/angular-aria/angular-aria.min.js',
    'bower/angular-messages/angular-messages.min.js',
    'bower/angular-material/angular-material.min.js',

    // Application
    'app/app.js',

    // Custom directives
    'app/directives/BackImgDirective.js',

    // Filters
    'app/filters/IsEmptyFilter.js',

    // Chart
    'app/services/UserService.js',
    'app/controllers/ChartsCtrl.js',

    // Services
    'app/services/GameUserService.js',
    'app/services/GameService.js',
    'app/services/CreateGameService.js',
    'app/services/UserSearchService.js',

    // Resources
    'app/resources/Player.js',
    'app/resources/Match.js',

    // Repositories
    'app/repositories/GamesRepository.js',

    // Controllers
    'app/controllers/GamesCtrl.js',
    'app/controllers/CreateGameCtrl.js',
    'app/controllers/UpdateGameCtrl.js',
    'app/controllers/ComplainersCtrl.js',
    'app/controllers/UsersEditCtrl.js',
    'app/controllers/UserProfileCtrl.js',

    // Signup
    'app/services/AuthUserService.js',
    'app/controllers/SignupCtrl.js',

    // Signin
    'app/controllers/SigninCtrl.js'

  ], 'public/js/app.js', 'resources/assets');
});
