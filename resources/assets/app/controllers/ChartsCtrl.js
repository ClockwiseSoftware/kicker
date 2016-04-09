app.controller('ChartsCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        $scope.todos = [];
        $scope.loading = false;

        $scope.init = function() {
            $scope.loading = true;
            $http.get('/chart')
                .success(function(data) {
                    $scope.users = [];
                    for (var i = 0; i < data.length; i++) {
                        var user = new User(data[i]);
                        $scope.users.push(user);
                    }
                    $scope.loading = false;
                });
        };


        $scope.init();
    }
]);