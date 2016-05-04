app.controller('UserProfileCtrl', [
    '$scope', '$http', 'Upload', 'Player',
    function($scope, $http, Upload, Player) {
        $scope.player = null;
        $scope.errors = {};
        $scope.loading = true;

        Player.get().$promise
            .then(function(player) {
                $scope.loading = false;
                $scope.player = player;
            });

        $scope.saveChanges = function (player) {
            $scope.errors = {};
            $scope.loading = true;

            Player.update({id: $scope.player.id}, player).$promise
                .then(function(res) {
                    $scope.loading = false;
                })
                .catch(function(res) {
                    $scope.loading = false;
                    $scope.errors = res.data;
                });
        };
    }
]);