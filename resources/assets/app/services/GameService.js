app.factory('Game', ['$http', '$filter', 'GameUser', function($http, $filter, GameUser) {
    function Game(data) {
        var obj = this;

        this.setData = function(data) {
            angular.extend(this, data);

            for (var i = 0; i < obj.games_users_a.length; i++) {
                obj.games_users_a[i] = new GameUser(obj.games_users_a[i]);
            }

            for (i = 0; i < obj.games_users_b.length; i++) {
                obj.games_users_b[i] = new GameUser(obj.games_users_b[i]);
            }

            obj.played_at = (function(date) {
                return $filter('date')(date, 'MM/dd/yyyy HH:mm');
            })(new Date(obj.played_at));
        };

        this.gamePointClass = function(team) {
            var firstTeamsPoints = obj.team_a_points,
                secondTeamsPoints = obj.team_b_points;

            if (team === 'b') {
                firstTeamsPoints = obj.team_b_points;
                secondTeamsPoints = obj.team_a_points;
            }

            if (firstTeamsPoints > secondTeamsPoints)
                return 'win';
            else if (firstTeamsPoints < secondTeamsPoints)
                return 'lose';
            else
                return 'draw';
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return Game;
}]);