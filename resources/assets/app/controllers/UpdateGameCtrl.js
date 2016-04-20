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