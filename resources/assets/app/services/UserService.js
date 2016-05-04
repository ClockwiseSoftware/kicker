app.factory('User', ['$http', function($http) {
    function User(userData) {
        var self = this;

        this.editing = false;
        this.win_rate = 0.0;
        this.count_games = 0;

        this.setData = function(userData) {
            angular.extend(this, userData);

            var statAttr = ['count_looses', 'count_wins', 'count_draws'];
            for (index in statAttr) {
                if (statAttr.hasOwnProperty(index)) {
                    self[statAttr[index]] = parseInt(self[statAttr[index]]);
                    self[statAttr[index]] = isNaN(self[statAttr[index]]) ? 0 : self[statAttr[index]];
                }
            }

            self.count_games = countGames();
            self.win_rate = countWinRate();
        };

        var countGames = function() {
            self.count_games = self.count_looses + self.count_wins + self.count_draws;
            return self.count_games;
        };

        var countWinRate = function() {
            if (!self.count_games || isNaN(self.count_games))
                self.win_rate = 0;
            else
                self.win_rate = Math.floor(self.count_wins / self.count_games * 1000) / 1000;

            return self.win_rate;
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