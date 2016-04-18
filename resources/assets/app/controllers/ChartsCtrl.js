app.controller('ChartsCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        $scope.orderByField = 'index';
        $scope.reverseSort = false;
        $scope.users = [];
        $scope.me = null;

        $scope.init = function() {
            $scope.loading = true;
            $http.get('/chart')
                .success(function(users) {
                    angular.forEach(users, function(userData, index) {
                        userData.index = index + 1;
                        var user = new User(userData);
                        user.countGamesPlayed = user.countGames();

                        this.push(user);
                    }, $scope.users);
                });
        };

        $http.get('/user/me')
            .success(function(user) {
                if (!user)
                    return false;

                $scope.me = new User(user);
            });

        $scope.init();
    }
]);