app.controller('CreateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService', 'User',
    function($scope, $http, $location, $filter, CreateGameService, User) {
        $scope.loading = false;
        $scope.usersSearch = [];
        $scope.game = new CreateGameService();
        $scope.errors = {};
        $scope.number = 0;
        $scope.numberPattern = /^[0-1]?[0-9]{0,3}$/;

        $scope.findUsers = function (search) {
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