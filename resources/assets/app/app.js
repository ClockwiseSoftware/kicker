var app = angular
    .module('kickerApp', ['ngRoute'])
    .config(['$httpProvider', '$interpolateProvider', '$routeProvider',
        function ($httpProvider, $interpolateProvider, $routeProvider) {
            $interpolateProvider.startSymbol('<%');
            $interpolateProvider.endSymbol('%>');

            $routeProvider
                .when('/signup', {
                    templateUrl: 'html/views/auth/signup.html',
                    controller: 'SignupCtrl'
                })
                .when('/signin', {
                    templateUrl: 'html/views/auth/signin.html',
                    controller: 'SigninCtrl'
                })
                .when('/', {
                    templateUrl: 'html/views/games/index.html'
                })
                .when('/chart', {
                    templateUrl: 'html/views/chart/index.html'
                })

                // Because Facebook adds this parameter in hash after successful login
                .when('/_=_', {
                    templateUrl: 'html/views/games/index.html'
                });
        }
    ]);