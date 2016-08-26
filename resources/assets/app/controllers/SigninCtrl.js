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
                    $scope.errors = [];
                    console.log(response);
                    for (var field in response.data) {
                        var prop = response.data[field];

                        for (var i = 0; i < prop.length; i++) {
                            $scope.errors.push(prop[i]);
                        }
                    }
                });
        }
    }
]);