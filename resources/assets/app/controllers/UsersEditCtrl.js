app.controller('UsersEditCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        $scope.users = [];

        $scope.init = function() {
            $http({
                url: '/users',
                method: 'GET'
            }).success(function(response) {
                angular.forEach(response.data, function(data) {
                    var user = new User(data);
                    this.push(user);
                }, $scope.users);
                
                console.log($scope.users);
            });
        };

        $scope.init();
    }
]);