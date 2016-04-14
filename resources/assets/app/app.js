var app = angular
    .module('kickerApp', ['ngRoute'])
    .config(['$httpProvider', '$interpolateProvider', '$routeProvider',
        function ($httpProvider, $interpolateProvider, $routeProvider) {
            $interpolateProvider.startSymbol('<%');
            $interpolateProvider.endSymbol('%>');

            $routeProvider
                .when('/signup', {
                    templateUrl: 'html/views/auth/signup.html'
                })
                .when('/', {
                    templateUrl: 'html/views/games/index.html'
                })
                .when('/chart', {
                    templateUrl: 'html/views/chart/index.html'
                });
        }
    ]);