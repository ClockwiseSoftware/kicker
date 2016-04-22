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
app.factory('User', ['$http', function($http) {
    function User(userData) {
        var obj = this;
        this.editing = false;

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

        this.getFormData = function () {
            var data = {
                name: obj.name,
                email: obj.email
            };

            if (obj.password)
                data.password = obj.password;

            return data;
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
            })(Date.parseISO(obj.played_at));

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

        function transformDate(date) {
            return $filter('date')(date, 'MM/dd/yyyy HH:mm');
        }

        this.playedAt = transformDate(new Date());

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
            $this.playedAt = transformDate(Date.parseISO(data.played_at));
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
app.factory('UserSearch', ['$http', function($http) {
    function UserSearch() {}

    UserSearch.find = function(search, $scope) {
        if ($scope.searchRequestPending || $scope.game === null)
            return false;

        $scope.searchRequestPending = true;

        var exceptIds = $scope.game.getSelectedIds(),
            params = {};
        search = search ? search.trim() : search;

        if (exceptIds.length > 0)
            params['exceptIds[]'] = exceptIds;
        if (search)
            params.search = search;


        return $http.get('/user/search', {
            params: params
        }).then(function(response) {
            if (response.data.length === 0) {
                $scope.usersSearch = [{name: 'No results...'}];
            } else {
                $scope.usersSearch = response.data;
            }

            $scope.searchRequestPending = false;
        });
    };

    UserSearch.remove = function (user, $scope) {
        for (var i = 0; i < $scope.usersSearch.length; i++) {
            if (user.id === $scope.usersSearch[i].id) {
                $scope.usersSearch.splice(i, 1);
                break;
            }
        }
    };

    UserSearch.add = function (user, $scope) {
        $scope.usersSearch.unshift(user);
    };

    return UserSearch;
}]);
app.factory('GamesRepository', ['$http', 'Game', function($http, Game) {
    function GamesRepository() {
        this.storage = [];
        this.loading = false;
        this.lastpage = 0;
        this.currentpage = 0;

        var $this = this,
            indexesMap = {};

        this.add = function (data) {
            angular.forEach(data, function(data) {
                var game = new Game(data);
                this.push(game);

                indexesMap[game.id] = this.length - 1;
            }, $this.storage);
        };

        this.get = function (id) {
            var storageIndex = indexesMap[id];

            if ($this.storage.hasOwnProperty(storageIndex))
                return $this.storage[storageIndex];

            return null;
        };

        this.update = function (id, data) {
            var game = $this.get(id);
            angular.copy(new Game(data), game);

            return game;
        };

        this.load = function (callback) {
            $this.loading = true;

            $http({
                url: '/',
                method: 'GET',
                params: {
                    page: ($this.currentpage + 1)
                }
            }).success(function(response) {
                if (response.data.length > 0) {
                    $this.currentpage = response.current_page;
                    $this.lastpage = response.last_page;

                    $this.add(response.data);
                }
                
                console.log($this.currentpage, $this.lastpage);

                $this.loading = false;
            });

            if (callback)
                callback.call();
        };

        return this;
    }

    return GamesRepository;
}]);
app.controller('GamesCtrl', ['$scope', '$http', 'Game', 'GamesRepository',
    function($scope, $http, Game, GamesRepository) {
        $scope.gamesRepository = new GamesRepository();
        $scope.games = $scope.gamesRepository.storage;

        $scope.gamesRepository.load();

        // @TODO encapsulate it somewhere
        $scope.user = {
            isGuest: false,
            isUser: false,
            isAdmin: false
        };
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

        $scope.complain = function(id) {
            $http.get('/game/' + id + '/complain')
                .success(function(response) {
                    $http.get('/game/' + id)
                        .success(function(response) {
                            $scope.gamesRepository.update(response.id, response);
                        });
                });
        };
    }
]);
app.controller('CreateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService', 'UserSearch',
    function($scope, $http, $location, $filter, CreateGameService, UserSearch) {
        $scope.loading = false;
        $scope.game = new CreateGameService();
        $scope.errors = {};

        $scope.findUsers = function (search) {
            UserSearch.find(search, $scope);
        };

        $scope.onSelectUser = function (user) {
            UserSearch.remove(user, $scope);
        };

        $scope.onRemoveUser = function (user) {
            UserSearch.add(user, $scope);
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
            format: 'MM/DD/YYYY HH:mm',
            maxDate: (new Date())
        });
        $playedAt.on('dp.change', function() {
            $scope.game.playedAt = $(this).val();
        });
    }
]);
app.controller('UpdateGameCtrl', [
    '$scope', '$http', '$location', '$filter', '$routeParams', 'CreateGameService', 'UserSearch',
    function($scope, $http, $location, $filter, $routeParams, CreateGameService, UserSearch) {
        $scope.loading = false;
        $scope.gameId = $routeParams.id;
        $scope.game = null;

        $http.get('/game/' + $scope.gameId).then(function(response) {
            $scope.game = new CreateGameService(response.data);
            $scope.findUsers();
        });

        $scope.findUsers = function (search) {
            UserSearch.find(search, $scope);
        };

        $scope.onSelectUser = function (user) {
            UserSearch.remove(user, $scope);
        };

        $scope.onRemoveUser = function (user) {
            UserSearch.add(user, $scope);
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

        var $playedAt = $('#playedAt');
        $playedAt.datetimepicker({
            format: 'MM/DD/YYYY HH:mm',
            maxDate: (new Date())
        });
        $playedAt.on('dp.change', function() {
            $scope.game.playedAt = $(this).val();
        });
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
        $scope.inEditing = {};
        $scope.errors = {};

        function updateUser(id, user) {
            for (var i in $scope.users) {
                if ($scope.users[i].id === id) {
                    $scope.users[i] = user;
                    return true;
                }
            }

            return false;
        }

        function resetErrors(user) {
            $scope.errors[user.id] = {};
        }

        $scope.init = function () {
            $http({
                url: '/users',
                method: 'GET'
            }).success(function(response) {
                angular.forEach(response.data, function(data) {
                    this.push(new User(data));
                }, $scope.users);
            });
        };
        $scope.edit = function (user) {
            resetErrors(user);

            $http({
                url: '/user/' + user.id,
                method: 'PUT',
                data: user.getFormData()
            }).error(function(response) {
                $scope.errors[user.id] = response;
            }).success(function(response) {
                $scope.commitEditing(user);
                updateUser(user.id, new User(response));
            });
        };

        $scope.beginEditing = function (item) {
            resetErrors(item);
            item.editing = true;
            $scope.inEditing[item.id] = angular.copy(item);
        };
        $scope.rollbackEditing = function (item) {
            resetErrors(item);
            item = angular.copy($scope.inEditing[item.id]);
            item.editing = false;
            delete $scope.inEditing[item.id];

            return item;
        };
        $scope.commitEditing = function (item) {
            delete $scope.inEditing[item.id];
            item.editing = false;

            return item;
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