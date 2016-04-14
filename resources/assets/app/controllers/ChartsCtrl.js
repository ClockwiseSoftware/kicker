app.controller('ChartsCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        $scope.users = [];

        $scope.init = function() {
            $scope.loading = true;
            $http.get('/chart')
                .success(function(users) {
                    angular.forEach(users, function(userData, index) {
                        userData.index = index + 1;
                        var user = new User(userData);

                        this.push(user);
                    }, $scope.users);
                });
        };

        $scope.init();
    }
]);