var app = angular
    .module('kickerApp', [
        'ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap'
    ]).config(['$httpProvider', '$routeProvider',
        function ($httpProvider, $routeProvider) {
            $routeProvider
                // Signup and Signin pages
                .when('/signup', {
                    controller: 'SignupCtrl',
                    templateUrl: 'html/views/auth/signup.html'
                })
                .when('/signin', {
                    controller: 'SigninCtrl',
                    templateUrl: 'html/views/auth/signin.html'
                })

                // Games pages
                .when('/', {
                    controller: 'GamesCtrl',
                    templateUrl: 'html/views/games/index.html'
                })
                .when('/game/create', {
                    controller: 'CreateGameCtrl',
                    templateUrl: 'html/views/games/create.html'
                })
                .when('/game/:id/update', {
                    controller: 'UpdateGameCtrl',
                    templateUrl: 'html/views/games/update.html'
                })
                .when('/game/:id/complainers', {
                    controller: 'ComplainersCtrl',
                    templateUrl: 'html/views/games/complainers.html'
                })

                // Admin's pages
                // .when('/admin/users', {
                //     templateUrl: 'html/views/admin/users.html',
                //     controller: 'UsersEditCtrl'
                // })

                // Chart pages
                .when('/chart', {
                    templateUrl: 'html/views/chart/index.html'
                })

                // Because Facebook adds this parameter in hash after successful login
                .when('/_=_', {
                    controller: 'GamesCtrl',
                    templateUrl: 'html/views/games/index.html'
                });

            // Close navbar on navigate event
            $(window).on('popstate', function() {
                $('.navbar-collapse').collapse('hide');
            });

            // Close navbar on link click
            $('body').on('click', '.navbar-collapse li', function() {
                $(this).closest('.navbar-collapse').collapse('hide');
            });
        }
    ]);

Date.parseISO = function (string) {
    var date = new Date(string);

    // For Safari
    if (isNaN(date.getDate())) {
        var test = string.split(' '),
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