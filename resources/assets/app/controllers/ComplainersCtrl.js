app.controller('ComplainersCtrl', ['$scope', '$http', '$routeParams', 'Game',
    function($scope, $http, $routeParams, GameService) {
        $scope.loading = false;
        $scope.gameId = $routeParams.id;
        $scope.game = null;

        $http.get('/api/game/' + $scope.gameId).then(function(response) {
            $scope.game = new GameService(response.data);
        });
    }
]);