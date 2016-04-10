app.controller('GamesCtrl', ['$scope', '$http', 'Game',
    function($scope, $http, Game) {
        $scope.games = [];
        var map = {};

        $scope.init = function() {
            $http.get('/')
                .success(function(response) {
                    angular.forEach(response.data, function(data, index) {
                        var game = new Game(data);
                        this.push(game);

                        map[game.id] = index;
                    }, $scope.games);
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