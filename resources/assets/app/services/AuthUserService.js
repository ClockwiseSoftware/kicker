app.factory('AuthUser', ['$http', function($http) {
    function AuthUser(data) {
        var obj = this;

        this.email = null;
        this.name = null;
        this.password = null;

        this.setData = function(data) {
            angular.extend(this, data);
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return AuthUser;
}]);