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
            var data = {
                games_users_a: $scope.game.teamIds('a'),
                team_a_points: $scope.game.points.a,
                games_users_b: $scope.game.teamIds('b'),
                team_b_points: $scope.game.points.b,
                played_at: $scope.game.playedAt
            };
            $scope.errors = {};

            $http.post('/game/create', data).error(function(response) {
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