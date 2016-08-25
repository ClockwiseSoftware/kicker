app.controller('SignupCtrl', ['$scope', '$http', '$location', '$window', 'AuthUser', '$auth',
    function($scope, $http, $location, $window, AuthUser, $auth) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.signup = function (user) {
            $http({
                url: '/signup',
                method: 'POST',
                data: $scope.user
            }).success(function() {
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