app.factory('Game', ['$http', '$filter', '$sce', 'GameUser', 'User', function($http, $filter, $sce, GameUser, User) {
    function Game(data) {
        var obj = this;
        this.complaintsHtml = '';
        this.tooltipIsVisible = false;
        this.loading = false;

        this.setData = function(data) {
            angular.extend(this, data);

            for (var i = 0; i < obj.games_users_a.length; i++) {
                obj.games_users_a[i] = new GameUser(obj.games_users_a[i]);
            }

            for (i = 0; i < obj.games_users_b.length; i++) {
                obj.games_users_b[i] = new GameUser(obj.games_users_b[i]);
            }

            for (i = 0; i < obj.complaints.length; i++) {
                obj.complaints[i].user = new User(obj.complaints[i].user);
            }

            obj.played_at = (function(date) {
                return $filter('date')(date, 'MM/dd/yyyy HH:mm');
            })(Date.parseISO(obj.played_at));

            obj.complaintsHtml = (function (complaints) {
                var maxComplainers = 5,
                    html = '',
                    iterations = complaints.length > maxComplainers ? maxComplainers : complaints.length;

                if (complaints.length <= 0)
                    return null;


                for (var i = 0; i < iterations; i++) {
                    var user = obj.complaints[i].user;

                    if (!user)
                        continue;

                    html +=
                        '<span class="complain-user">' +
                        '<img src="' + user.avatarUrl() + '" />' +
                        '</span>';
                }

                html += '<div><a href="#/game/' + obj.id + '/complainers" class="see-all-complainers">See all</a></div>';

                return $sce.trustAsHtml(html);
            })(obj.complaints);
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

    Game.prototype.MAX_POINTS = 10;
    Game.prototype.MIN_POINTS = 0;

    return Game;
}]);