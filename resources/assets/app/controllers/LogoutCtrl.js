app.controller('LogoutCtrl', ['$scope', '$location', '$window', '$auth',
    function($scope, $location, $window, $auth) {
        $auth
            .logout ()
            .then(function (response) {
                $window.location.href = '/';
            });
    }
]);