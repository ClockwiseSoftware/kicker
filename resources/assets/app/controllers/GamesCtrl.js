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
                        });
                });
        };

        $scope.init();
    }
]);