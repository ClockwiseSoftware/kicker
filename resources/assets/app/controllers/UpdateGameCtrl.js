app.controller('UpdateGameCtrl', ['$scope', '$http', '$location', '$filter', '$routeParams', 'CreateGameService', 'User',
    function($scope, $http, $location, $filter, $routeParams, CreateGameService, User) {
        $scope.loading = false;
        $scope.gameId = $routeParams.id;
        $scope.game = null;

        $http.get('/game/' + $scope.gameId).then(function(response) {
            $scope.game = new CreateGameService(response.data);
            $scope.findUsers();
        });

        $scope.findUsers = function (search) {
            if (!$scope.game)
                return false;

            User.findUsers(search, $scope);
        };

        $scope.onSelectUser = function (user, model) {
            for (var i = 0; i < $scope.usersSearch.length; i++) {
                if (user.id === $scope.usersSearch[i].id) {
                    $scope.usersSearch.splice(i, 1);
                    break;
                }
            }
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