app.controller('UserProfileCtrl', [
    '$scope', '$http', 'Upload', 'Player',
    function($scope, $http, Upload, Player) {
        $scope.player = null;

        Player.get(function(data) {
            $scope.player = data;
        });
    }
]);