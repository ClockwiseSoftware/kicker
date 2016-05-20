var app = angular
  .module('kickerApp', [
    'ngRoute', 'ngSanitize', 'ui.bootstrap',
    'ngFileUpload', 'ngResource', 'ngAnimate',
    'ngDialog', 'ngMaterial', 'ngMessages'
  ]).config([
    '$httpProvider', '$routeProvider',
    function ($httpProvider, $routeProvider) {
      $routeProvider
      // Signup and Signin pages
        .when('/signup', {
          controller: 'SignupCtrl',
          templateUrl: 'html/auth/signup.html'
        })
        .when('/signin', {
          controller: 'SigninCtrl',
          templateUrl: 'html/auth/signin.html'
        })

        // Games pages
        .when('/', {
          controller: 'GamesCtrl',
          templateUrl: 'html/games/index.html'
        })
        .when('/game/create', {
          controller: 'CreateGameCtrl',
          templateUrl: 'html/games/create.html'
        })
        .when('/game/:id/update', {
          controller: 'UpdateGameCtrl',
          templateUrl: 'html/games/update.html'
        })
        .when('/game/:id/complainers', {
          controller: 'ComplainersCtrl',
          templateUrl: 'html/games/complainers.html'
        })

        // Admin's pages
        .when('/admin/users', {
          templateUrl: 'html/admin/users.html',
          controller: 'UsersEditCtrl'
        })

        // User's pages
        .when('/user/profile', {
          templateUrl: 'html/user/profile.html',
          controller: 'UserProfileCtrl'
        })

        // Chart pages
        .when('/chart', {
          templateUrl: 'html/chart/index.html'
        })

        // Because Facebook adds this parameter in hash after successful login
        .when('/_=_', {
          controller: 'GamesCtrl',
          templateUrl: 'html/games/index.html'
        });
    }
  ])
  .run([
    '$rootScope', 'Player',
    function ($, Player) {
      $.currentPlayer = null;

      $.restoreProfile = function restoreProfile() {
        Player.restore({id: $.currentPlayer.id}).$promise
          .then(function (player) {
            $.currentPlayer = player;
          })
          .catch(function (player) {
            $.currentPlayer = player;
          });
      };

      Player.me().$promise
        .then(function (player) {
          player.deleted = parseInt(player.deleted);
          player.deleted = isNaN(player.deleted) ? false : !!player.deleted;
          $.currentPlayer = player;
        });
    }
  ])
  .run(['$rootScope', function ($) {
    $.loading = false;

    $.$on('startLoading', function(event) {
      $.loading = true;
    });
    $.$on('finishLoading', function(event) {
      $.loading = false;
    });
  }])
  .run(function () {
    if ('ontouchstart' in document) {
      angular.element('body').removeClass('no-touch');
    }
  })
  .run(function () {
    var $navBar = jQuery('.navbar-collapse');

    // Close navbar on navigate event
    jQuery(window).on('popstate', function () {
      $navBar.collapse('hide');
    });

    // Close navbar on body click
    jQuery('body').on('click', function (event) {
      var clickover = jQuery(event.target);
      var _opened = $navBar.hasClass('in');

      if (_opened === true && !clickover.hasClass('navbar-toggle')) {
        $navBar.collapse('hide');
      }
    });

    jQuery(document).on('scroll', function () {
      var _opened = $navBar.hasClass('in');

      if (_opened) {
        $navBar.collapse('hide');
      }
    });
  });

Date.parseISO = function (string) {
  var date = new Date(string);

  // For Safari
  if (isNaN(date.getDate())) {
    var test      = string.split(' '),
        dateParts = test[0].split('-'),
        timeParts = test[1].split(':');

    for (var i = 0; i < dateParts.length; i++) {
      dateParts[i] = parseInt(dateParts[i]);
    }
    for (i = 0; i < timeParts.length; i++) {
      timeParts[i] = parseInt(timeParts[i]);
    }

    date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
  }

  return date;
};