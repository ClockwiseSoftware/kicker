app.factory('User', ['$http', function($http) {
    function User(userData) {
        this.setData = function(userData) {
            angular.extend(this, userData);
        };

        this.countGames = function() {
            return this.count_looses + this.count_wins + this.count_draws;
        };

        if (userData) {
            this.setData(userData);
        }

        return this;
    }

    return User;
}]);