app.controller('SignupCtrl', ['$scope', '$http', '$location', '$window', 'AuthUser', '$auth',
    function($scope, $http, $location, $window, AuthUser, $auth) {
        $scope.user = new AuthUser();
        $scope.errors = [];

        $scope.signup = function (user) {
            $auth
                .signup(user)
                .then(function (response) {
                    $auth
                        .login({
                            'email': user.email,
                            'password': user.password
                        })
                        .then(function (response) {
                            // console.log(response);
                            $window.location.href = '/';
                        });
                })
                .catch(function (response) {
                    $scope.errors = [];
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