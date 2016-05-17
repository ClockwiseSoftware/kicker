app.factory('GameUser', ['$http', 'User', function($http, User) {
    function GameUser(data) {
        var obj = this;

        this.setData = function(data) {
            angular.extend(this, data);

            obj.user = new User(obj.user);
        };
        
        this.getDelta = function() {
            return obj.rating_after - obj.rating_before;
        };

        this.userPointsClass = function() {
            return obj.getDelta() >= 0 ? 'win' : 'lose';
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return GameUser;
}]);