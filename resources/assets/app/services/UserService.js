app.factory('User', ['$http', function($http) {
    function User(userData) {
        var self = this;
        this.editing = false;

        this.setData = function(userData) {
            angular.extend(this, userData);

            var statAttr = ['count_looses', 'count_wins', 'count_draws'];
            for (index in statAttr) {
                if (statAttr.hasOwnProperty(index)) {
                    self[statAttr[index]] = parseInt(self[statAttr[index]]);
                    self[statAttr[index]] = isNaN(self[statAttr[index]]) ? 0 : self[statAttr[index]];
                }
            }
        };

        this.countGames = function() {
            return self.count_looses + self.count_wins + self.count_draws;
        };

        this.avatarUrl = function() {
            if (self.avatar_url)
                return self.avatar_url;

            return '/img/no-avatar.min.png';
        };

        this.getFormData = function () {
            var data = {
                name: self.name,
                email: self.email
            };

            if (self.password)
                data.password = self.password;

            return data;
        };

        if (userData) {
            this.setData(userData);
        }

        return this;
    }

    return User;
}]);