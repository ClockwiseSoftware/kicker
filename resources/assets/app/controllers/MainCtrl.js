app.controller('MainCtrl', ['$scope','$rootScope', '$auth', '$window', '$http',
    function($scope, $rootScope, $auth, $window, $http) {

        $scope.isAuth = function () {
            return $auth.isAuthenticated();
        };

        $scope.logout = function () {
            $auth
                .logout()
                .then(function () {
                    $window.location.href = '/';
                });
        };

        // @TODO encapsulate it somewhere
        $scope.user = {
            isGuest: false,
            isUser: false,
            isAdmin: false
        };
        function getUserRole() {
            $http({
                url: '/api/users/role',
                method: 'GET'
            }).success(function (role) {
                if (role === 'guest') {
                    $scope.user.isGuest = true;
                } else if (role === 'user') {
                    $scope.user.isUser = true;
                } else if (role === 'admin') {
                    $scope.user.isAdmin = true;
                }
                return role;
            });
        }

        $scope.userRole = getUserRole();

        $scope.views = [
            {
                title: "Games",
                url: "",
                cond: "any"
            },

            {
                title: "Chart",
                url: "chart",
                cond: "any",
                default: true
            },

            {
                title: "Add Game",
                url: "game/create",
                cond: "auth"
            },


            {
                title: "Profile",
                url: "user/profile",
                cond: "auth"
            },

            {
                title: "Login",
                url: "signin",
                cond: "noauth"
            },

            {
                title: "Signup",
                url: "signup",
                cond: "noauth"
            }];

    }
]);