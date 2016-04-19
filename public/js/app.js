var app = angular
    .module('kickerApp', ['ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap'])
    .config(['$httpProvider', '$interpolateProvider', '$routeProvider',
        function ($httpProvider, $interpolateProvider, $routeProvider) {
            $interpolateProvider.startSymbol('<%');
            $interpolateProvider.endSymbol('%>');

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

                // admin pages
                .when('/admin/users', {
                    templateUrl: 'html/views/admin/users.html',
                    controller: 'UsersEditCtrl'
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
        $scope.orderByField = 'index';
        $scope.reverseSort = false;
        $scope.users = [];
        $scope.me = null;

        $scope.init = function() {
            $scope.loading = true;
            $http.get('/chart')
                .success(function(users) {
                    angular.forEach(users, function(userData, index) {
                        userData.index = index + 1;
                        var user = new User(userData);
                        user.countGamesPlayed = user.countGames();

                        this.push(user);
                    }, $scope.users);
                });
        };

        $http.get('/user/me')
            .success(function(user) {
                if (!user)
                    return false;

                $scope.me = new User(user);
            });

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
app.factory('Game', ['$http', '$filter', '$sce', 'GameUser', 'User', function($http, $filter, $sce, GameUser, User) {
    function Game(data) {
        var obj = this;
        this.complaintsHtml = '';
        this.tooltipIsVisible = false;

        this.setData = function(data) {
            angular.extend(this, data);

            for (var i = 0; i < obj.games_users_a.length; i++) {
                obj.games_users_a[i] = new GameUser(obj.games_users_a[i]);
            }

            for (i = 0; i < obj.games_users_b.length; i++) {
                obj.games_users_b[i] = new GameUser(obj.games_users_b[i]);
            }

            for (i = 0; i < obj.complaints.length; i++) {
                obj.complaints[i].user = new User(obj.complaints[i].user);
            }

            obj.played_at = (function(date) {
                return $filter('date')(date, 'MM/dd/yyyy HH:mm');
            })(new Date(obj.played_at));

            obj.complaintsHtml = (function (complaints) {
                var maxComplainers = 5,
                    html = '',
                    iterations = complaints.length > maxComplainers ? maxComplainers : complaints.length;

                if (complaints.length <= 0)
                    return null;


                for (var i = 0; i < iterations; i++) {
                    var user = obj.complaints[i].user;

                    if (!user)
                        continue;

                    html +=
                        '<span class="complain-user">' +
                        '<img src="' + user.avatarUrl() + '" />' +
                        '</span>';
                }

                html += '<div><a href="#/game/' + obj.id + '/complainers" class="see-all-complainers">See all</a></div>';

                return $sce.trustAsHtml(html);
            })(obj.complaints);
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

    Game.prototype.MAX_POINTS = 10;
    Game.prototype.MIN_POINTS = 0;

    return Game;
}]);
app.factory('CreateGameService', ['$http', '$filter', function($http, $filter) {
    function CreateGameService(data) {
        var $this = this;

        this.id = null;
        this.users = {
            a: [],
            b: []
        };
        this.points = {
            a: 0,
            b: 0
        };
        this.playedAt = (function(date) {
            return $filter('date')(date, 'MM/dd/yyyy HH:mm');
        })(new Date());

        this.teamIds = function (teamIndex) {
            var users = this.users[teamIndex],
                ids = [];

            angular.forEach(users, function(user) {
                this.push(user.id);
            }, ids);

            return ids;
        };

        this.getSelectedIds = function () {
            return this.teamIds('a').concat(this.teamIds('b'));
        };

        this.exportUsers = function (data, teamIndex) {
            var users = [];

            angular.forEach(data['games_users_' + teamIndex], function(game_user) {
                this.push(game_user.user);
            }, users);

            return users;
        };

        this.setData = function(data) {
            $this.users = {
                a: $this.exportUsers(data, 'a'),
                b: $this.exportUsers(data, 'b')
            };
            $this.points = {
                a: data.team_a_points,
                b: data.team_b_points
            };
            $this.playedAt = data.played_at;
            $this.id = data.id;
        };

        this.getFormData = function () {
            return {
                games_users_a: $this.teamIds('a'),
                team_a_points: $this.points.a,
                games_users_b: $this.teamIds('b'),
                team_b_points: $this.points.b,
                played_at: $this.playedAt
            }
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    CreateGameService.prototype.MAX_POINTS = 10;
    CreateGameService.prototype.MIN_POINTS = 0;

    return CreateGameService;
}]);
app.controller('GamesCtrl', ['$scope', '$http', 'Game',
    function($scope, $http, Game) {
        $scope.loading = false;
        $scope.lastpage = 1;
        $scope.currentpage = 0;
        $scope.games = [];
        $scope.loading = false;
        $scope.user = {
            isGuest: false,
            isUser: false,
            isAdmin: false
        };

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
                if (role === 'guest') {
                    $scope.user.isGuest = true;
                } else if (role === 'user') {
                    $scope.user.isUser = true;
                } else if (role === 'admin') {
                    $scope.user.isAdmin = true;
                }
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
                            game.tooltipIsVisible = true;
                        });
                });
        };

        $scope.init();
    }
]);
app.controller('CreateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService',
    function($scope, $http, $location, $filter, CreateGameService) {
        $scope.loading = false;
        $scope.usersSearch = [];
        $scope.game = new CreateGameService();
        $scope.errors = {};

        $scope.findUsers = function(search) {
            var params = {
                search: search,
                'exceptIds[]': $scope.game.getSelectedIds()
            };

            return $http.get('/user/search', {
                params: params
            }).then(function(response) {
                if (response.data.length === 0) {
                    $scope.usersSearch = [{name: 'No results...'}];
                } else {
                    $scope.usersSearch = response.data;
                }
            });
        };

        $scope.create = function() {
            $scope.errors = {};
            $scope.loading = true;

            $http.post('/game/create', $scope.game.getFormData()).error(function(response) {
                $scope.errors = response;
            }).then(function() {
                $scope.loading = false;
                $location.path('/');
            }, function () {
                $scope.loading = false;
            });
        };

        var $playedAt = $('#playedAt');
        $playedAt.datetimepicker({
            format: 'MM/DD/YYYY HH:mm'
        });
        $playedAt.on('dp.change', function() {
            $scope.game.playedAt = $(this).val();
        });
    }
]);
app.controller('UpdateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService', '$routeParams',
    function($scope, $http, $location, $filter, CreateGameService, $routeParams) {
        $scope.loading = false;
        $scope.gameId = $routeParams.id;
        $scope.game = null;

        $http.get('/game/' + $scope.gameId).then(function(response) {
            $scope.game = new CreateGameService(response.data);
        });

        $scope.findUsers = function(search) {
            var params = {
                search: search,
                'exceptIds[]': $scope.game ? $scope.game.getSelectedIds() : []
            };

            return $http.get('/user/search', {
                params: params
            }).then(function(response) {
                if (response.data.length === 0) {
                    $scope.usersSearch = [{name: 'No results...'}];
                } else {
                    $scope.usersSearch = response.data;
                }
            });
        };

        $scope.update = function() {
            $scope.errors = {};
            $scope.loading = true;

            $http.post('/game/' + $scope.game.id + '/update', $scope.game.getFormData()).error(function(response) {
                $scope.loading = false;
                $scope.errors = response;
            }).then(function() {
                $scope.loading = false;
                $location.path('/');
            });
        };
    }
]);
app.controller('ComplainersCtrl', ['$scope', '$http', '$routeParams', 'Game',
    function($scope, $http, $routeParams, GameService) {
        $scope.loading = false;
        $scope.gameId = $routeParams.id;
        $scope.game = null;

        $http.get('/game/' + $scope.gameId).then(function(response) {
            $scope.game = new GameService(response.data);
        });
    }
]);
app.controller('UsersEditCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        $scope.users = [];

        $scope.init = function() {
            $http({
                url: '/users',
                method: 'GET'
            }).success(function(response) {
                angular.forEach(response.data, function(data) {
                    var user = new User(data);
                    this.push(user);
                }, $scope.users);
                
                console.log($scope.users);
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