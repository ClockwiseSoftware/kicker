app.controller('CreateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService',
    function($scope, $http, $location, $filter, CreateGameService) {
        $scope.loading = false;
        $scope.usersSearch = [];
        $scope.game = new CreateGameService();
        $scope.errors = {};

        $scope.findUsers = function(search) {
            var params = {
                search: search,
                'exceptIds[]': $scope.game.getSelectedIds()
            };

            return $http.get('/user/search', {
                params: params
            }).then(function(response) {
                if (response.data.length === 0) {
                    $scope.usersSearch = [{name: 'No results...'}];
                } else {
                    $scope.usersSearch = response.data;
                }
            });
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