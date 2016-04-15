app.controller('CreateGameCtrl', ['$scope', '$http', '$location', '$filter', 'CreateGameService',
    function($scope, $http, $location, $filter, CreateGameService) {
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
                $scope.usersSearch = response.data;
            });
        };

        $scope.create = function() {
            $scope.errors = {};

            $http.post('/game/create', $scope.game.getFormData()).error(function(response) {
                $scope.errors = response;
            }).then(function() {
                $location.path('/');
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