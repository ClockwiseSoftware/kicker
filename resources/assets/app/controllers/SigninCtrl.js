app.controller('SigninCtrl', ['$scope', '$http', '$location', '$window', 'AuthUser', '$auth',
    function($scope, $http, $location, $window, AuthUser, $auth) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.signin = function (user) {
            console.log(user);
            $auth
                .login ({
                    'email': user.email,
                    'password': user.password
                })
                .then(function (response) {
                    $window.location.href = '/';
                })
                .catch(function (response) {
                    console.log(response);
                    $scope.errors = [];
                    $scope.errors.push(response.statusText);
                });
        }
    }
]);