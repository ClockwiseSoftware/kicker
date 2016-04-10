app.factory('User', ['$http', function($http) {
    function User(userData) {
        var obj = this;

        this.setData = function(userData) {
            angular.extend(this, userData);
        };

        this.countGames = function() {
            return obj.count_looses + obj.count_wins + obj.count_draws;
        };

        this.avatarUrl = function() {
            if (obj.avatar_url)
                return obj.avatar_url;

            return '/img/no-avatar.min.png';
        };

        if (userData) {
            this.setData(userData);
        }

        return this;
    }

    return User;
}]);