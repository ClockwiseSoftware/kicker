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