app.controller('MainCtrl', ['$scope', '$auth', '$window',
    function($scope, $auth, $window) {

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