app.controller('SigninCtrl', ['$scope', '$http', '$location', '$window', 'AuthUser',
    function($scope, $http, $location, $window, AuthUser) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.signin = function (user) {
            $http({
                url: '/signin',
                method: 'POST',
                data: $scope.user
            }).success(function(res) {
                $window.location.href = '/';
            }).error(function(res) {
                $scope.errors = [];

                for (var attr in res) {
                    if (!res.hasOwnProperty(attr))
                        continue;

                    for (var i = 0; i < res[attr].length; i++) {
                        $scope.errors.push(res[attr][i]);
                    }
                }
            });
        }
    }
]);