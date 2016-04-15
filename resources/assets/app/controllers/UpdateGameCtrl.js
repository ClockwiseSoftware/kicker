app.controller('UpdateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService', '$routeParams',
    function($scope, $http, $location, $filter, CreateGameService, $routeParams) {
        $scope.gameId = $routeParams.id;
        $scope.game = null;

        $http.get('/game/' + $scope.gameId).then(function(response) {
            $scope.game = new CreateGameService(response.data);
        });

        $scope.findUsers = function(search) {
            var params = {
                search: search,
                'exceptIds[]': $scope.game.getSelectedIds()
            };

            return $http.get('/user/search', {
                params: params
            }).then(function(response) {
                $scope.usersSearch = response.data;
            });
        };

        $scope.update = function() {
            $scope.errors = {};

            $http.post('/game/' + $scope.game.id + '/update', $scope.game.getFormData()).error(function(response) {
                $scope.errors = response;
            }).then(function() {
                $location.path('/');
            });
        };
    }
]);