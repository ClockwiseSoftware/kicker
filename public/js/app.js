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
app.factory('User', ['$http', function($http) {
    function User(userData) {
        var obj = this;

        this.setData = function(userData) {
            angular.extend(this, userData);
        };

        this.countGames = function() {
            return obj.count_looses + obj.count_wins + obj.count_draws;
        };

        this.avatarUrl = function() {
            if (obj.avatar_url)
                return obj.avatar_url;

            return '/img/no-avatar.min.png';
        };

        if (userData) {
            this.setData(userData);
        }

        return this;
    }

    return User;
}]);
app.controller('ChartsCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        $scope.users = [];

        $scope.init = function() {
            $scope.loading = true;
            $http.get('/chart')
                .success(function(users) {
                    angular.forEach(users, function(userData, index) {
                        userData.index = index + 1;
                        var user = new User(userData);

                        this.push(user);
                    }, $scope.users);
                });
        };

        $scope.init();
    }
]);
app.factory('GameUser', ['$http', 'User', function($http, User) {
    function GameUser(data) {
        var obj = this;

        this.setData = function(data) {
            angular.extend(this, data);

            obj.user = new User(obj.user);
        };
        
        this.getDelta = function() {
            return obj.rating_after - obj.rating_before;
        };

        this.userPointsClass = function() {
            return obj.getDelta() > 0 ? 'win' : 'lose';
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return GameUser;
}]);
app.factory('Game', ['$http', 'GameUser', function($http, GameUser) {
    function Game(data) {
        var obj = this;

        this.setData = function(data) {
            angular.extend(this, data);

            for (var i = 0; i < obj.games_users_a.length; i++) {
                obj.games_users_a[i] = new GameUser(obj.games_users_a[i]);
            }

            for (i = 0; i < obj.games_users_b.length; i++) {
                obj.games_users_b[i] = new GameUser(obj.games_users_b[i]);
            }
        };

        this.gamePointClass = function(team) {
            var firstTeamsPoints = obj.team_a_points,
                secondTeamsPoints = obj.team_b_points;

            if (team === 'b') {
                firstTeamsPoints = obj.team_b_points;
                secondTeamsPoints = obj.team_a_points;
            }

            if (firstTeamsPoints > secondTeamsPoints)
                return 'win';
            else if (firstTeamsPoints < secondTeamsPoints)
                return 'lose';
            else
                return 'draw';
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return Game;
}]);
app.controller('GamesCtrl', ['$scope', '$http', 'Game',
    function($scope, $http, Game) {
        $scope.lastpage = 1;
        $scope.currentpage = 0;
        $scope.games = [];
        $scope.loading = false;
        $scope.userRole = null;

        var map = {};

        function addGames(data) {
            angular.forEach(data, function(data) {
                var game = new Game(data);
                this.push(game);

                map[game.id] = this.length - 1;
            }, $scope.games);
        }

        function getUserRole() {
            $http({
                url: '/user/role',
                method: 'GET'
            }).success(function(role) {
                $scope.userRole = role;
            });
        }

        $scope.userRole = getUserRole();

        $scope.init = function() {
            $http({
                url: '/',
                method: 'GET',
                params: {page: $scope.currentpage}
            })
            .success(function(response) {
                $scope.currentpage = response.current_page;
                $scope.lastpage = response.last_page;

                addGames(response.data);
            });
        };

        $scope.loadMore = function() {
            $scope.loading = true;

            $http({
                url: '/',
                method: 'GET',
                params: {page: $scope.currentpage + 1}
            })
            .success(function(response) {
                $scope.currentpage = response.current_page;
                $scope.lastpage = response.last_page;

                addGames(response.data);
                $scope.loading = false;
            });
        };

        $scope.complain = function(id) {
            $http.get('/game/' + id + '/complain')
                .success(function(response) {
                    $http.get('/game/' + id)
                        .success(function(response) {
                            var game = new Game(response),
                                scopeIndex = map[game.id];

                            $scope.games[scopeIndex] = game;
                        });
                });
        };

        $scope.init();
    }
]);
app.factory('AuthUser', ['$http', function($http) {
    function AuthUser(data) {
        var obj = this;

        this.email = null;
        this.name = null;
        this.password = null;

        this.setData = function(data) {
            angular.extend(this, data);
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return AuthUser;
}]);
app.controller('SignupCtrl', ['$scope', '$http', '$location', '$window', 'AuthUser',
    function($scope, $http, $location, $window, AuthUser) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.signup = function (user) {
            $http({
                url: '/signup',
                method: 'POST',
                data: $scope.user
            }).success(function() {
                $window.location.href = '/';
            }).error(function(res) {
                $scope.errors = [];

                for (var attr in res) {
                    if (!res.hasOwnProperty(attr))
                        continue;

                    for (var i = 0; i < res[attr].length; i++) {
                        $scope.errors.push(res[attr][i]);
                    }
                }
            });
        }
    }
]);
app.controller('SigninCtrl', ['$scope', '$http', '$location', '$window', 'AuthUser',
    function($scope, $http, $location, $window, AuthUser) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.signin = function (user) {
            $http({
                url: '/signin',
                method: 'POST',
                data: $scope.user
            }).success(function(res) {
                $window.location.href = '/';
            }).error(function(res) {
                $scope.errors = [];

                for (var attr in res) {
                    if (!res.hasOwnProperty(attr))
                        continue;

                    for (var i = 0; i < res[attr].length; i++) {
                        $scope.errors.push(res[attr][i]);
                    }
                }
            });
        }
    }
]);