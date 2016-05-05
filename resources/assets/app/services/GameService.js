app.factory('Game', ['$http', '$filter', '$sce', 'GameUser', 'User', function($http, $filter, $sce, GameUser, User) {
    function Game(data) {
        var _this = this;
        this.complaintsHtml = '';
        this.tooltipIsVisible = false;
        this.loading = false;

        this.setData = function(data) {
            angular.extend(this, data);

            for (var i = 0; i < _this.games_users_a.length; i++) {
                _this.games_users_a[i] = new GameUser(_this.games_users_a[i]);
            }

            for (i = 0; i < _this.games_users_b.length; i++) {
                _this.games_users_b[i] = new GameUser(_this.games_users_b[i]);
            }

            for (i = 0; i < _this.complaints.length; i++) {
                _this.complaints[i].user = new User(_this.complaints[i].user);
            }

            _this.played_at = (function(date) {
                return $filter('date')(date, 'MM/dd/yyyy HH:mm');
            })(Date.parseISO(_this.played_at));

            _this.complaintsHtml = (function (complaints) {
                var maxComplainers = 5,
                    html = '',
                    iterations = complaints.length > maxComplainers ? maxComplainers : complaints.length;

                if (complaints.length <= 0)
                    return null;


                for (var i = 0; i < iterations; i++) {
                    var user = _this.complaints[i].user;

                    if (!user)
                        continue;

                    html +=
                        '<span class="complain-user">' +
                        '<img src="' + user.avatarUrl() + '" />' +
                        '</span>';
                }

                html += '<div><a href="#/game/' + _this.id + '/complainers" class="see-all-complainers">See all</a></div>';

                return $sce.trustAsHtml(html);
            })(_this.complaints);
        };

        this.gamePointClass = function(team) {
            var firstTeamsPoints = _this.team_a_points;
            var secondTeamsPoints = _this.team_b_points;

            if (team === 'b') {
                firstTeamsPoints = _this.team_b_points;
                secondTeamsPoints = _this.team_a_points;
            }

            firstTeamsPoints = parseInt(firstTeamsPoints, 10);
            firstTeamsPoints = isNaN(firstTeamsPoints) ? 0 : firstTeamsPoints;
            secondTeamsPoints = parseInt(secondTeamsPoints, 10);
            secondTeamsPoints = isNaN(secondTeamsPoints) ? 0 : secondTeamsPoints;

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