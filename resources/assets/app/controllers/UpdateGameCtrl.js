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
                $scope.usersSearch = response.data;
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