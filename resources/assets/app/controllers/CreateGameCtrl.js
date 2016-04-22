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