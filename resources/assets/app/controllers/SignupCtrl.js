app.controller('SignupCtrl', ['$scope', '$http', 'AuthUser',
    function($scope, $http, AuthUser) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.update = function (user) {
            $http({
                url: '/signin',
                method: 'POST'
            }).success(function(res) {
            }).error(function(res) {
                $scope.errors = [];

                for (var attr in res) {
                    for (var i = 0; i < res[attr].length; i++) {
                        $scope.errors.push(res[attr][i]);
                    }
                }
            });
        }
    }
]);