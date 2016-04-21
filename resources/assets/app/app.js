var app = angular
    .module('kickerApp', [
        'ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap'
    ]).config(['$httpProvider', '$routeProvider',
        function ($httpProvider, $routeProvider) {
            $routeProvider
                // Signup and Signin pages
                .when('/signup', {
                    templateUrl: 'html/views/auth/signup.html',
                    controller: 'SignupCtrl'
                })
                .when('/signin', {
                    templateUrl: 'html/views/auth/signin.html',
                    controller: 'SigninCtrl'
                })

                // Games pages
                .when('/', {
                    templateUrl: 'html/views/games/index.html'
                })
                .when('/game/create', {
                    templateUrl: 'html/views/games/create.html',
                    controller: 'CreateGameCtrl'
                })
                .when('/game/:id/update', {
                    templateUrl: 'html/views/games/update.html',
                    controller: 'UpdateGameCtrl'
                })
                .when('/game/:id/complainers', {
                    templateUrl: 'html/views/games/complainers.html',
                    controller: 'ComplainersCtrl'
                })

                // Chart pages
                .when('/chart', {
                    templateUrl: 'html/views/chart/index.html'
                })

                // Because Facebook adds this parameter in hash after successful login
                .when('/_=_', {
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

app.directive('numberOnly', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, modelCtrl) {
            modelCtrl.$parsers.push(function (text) {
                var temp = parseInt(text),
                    min = parseInt(attr.min),
                    max = parseInt(attr.max),
                    result = min;

                if (temp > max) {
                    result = max;
                } else if (temp >= min) {
                    result = temp;
                } else {
                    result = min;
                }

                modelCtrl.$setViewValue(result);
                modelCtrl.$render();

                return result;
            });
        }
    };
});

app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});