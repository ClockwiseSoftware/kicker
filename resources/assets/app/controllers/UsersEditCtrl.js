app.controller('UsersEditCtrl', [
    '$scope', '$http', 'Upload', 'User',
    function($scope, $http, Upload, User) {
        $scope.users = [];
        $scope.inEditing = {};
        $scope.errors = {};

        $scope.uploadPic = function(file, user) {
            file.upload = Upload.upload({
                url: '/api/user/' + user.id + '/avatar',
                method: 'POST',
                data: {
                    avatar: file
                }
            }).then(function(res) {
                for (var i in $scope.users) {
                    if ($scope.users[i].id === user.id) {
                        $scope.users[i].avatar_url = res.data.avatar_url;
                        return true;
                    }
                }
            }).catch(function() {

            });
        };

        function updateUser(id, user) {
            for (var i in $scope.users) {
                if ($scope.users[i].id === id) {
                    $scope.users[i] = user;
                    return true;
                }
            }

            return false;
        }

        function resetErrors(user) {
            $scope.errors[user.id] = {};
        }

        $scope.init = function () {
            $http({
                url: '/api/users',
                method: 'GET'
            }).success(function(response) {
                angular.forEach(response.data, function(data) {
                    this.push(new User(data));
                }, $scope.users);
            });
        };
        $scope.edit = function (user) {
            resetErrors(user);

            $http({
                url: '/api/user/' + user.id,
                method: 'PUT',
                data: user.getFormData()
            }).error(function(response) {
                $scope.errors[user.id] = response;
            }).success(function(response) {
                $scope.commitEditing(user);
                updateUser(user.id, new User(response));
            });
        };

        $scope.beginEditing = function (item) {
            resetErrors(item);
            item.editing = true;
            $scope.inEditing[item.id] = angular.copy(item);
        };
        $scope.rollbackEditing = function (item) {
            resetErrors(item);
            item = angular.copy($scope.inEditing[item.id]);
            item.editing = false;
            delete $scope.inEditing[item.id];

            return item;
        };
        $scope.commitEditing = function (item) {
            delete $scope.inEditing[item.id];
            item.editing = false;

            return item;
        };

        $scope.init();
    }
]);