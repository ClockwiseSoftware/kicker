app.factory('CreateGameService', ['$http', '$filter', function($http, $filter) {
    function CreateGameService(data) {
        var $this = this;

        this.id = null;
        this.users = {
            a: [],
            b: []
        };
        this.points = {
            a: 0,
            b: 0
        };

        function transformDate(date) {
            return $filter('date')(date, 'MM/dd/yyyy HH:mm');
        }

        this.playedAt = transformDate(new Date());

        this.teamIds = function (teamIndex) {
            var users = this.users[teamIndex],
                ids = [];

            angular.forEach(users, function(user) {
                this.push(user.id);
            }, ids);

            return ids;
        };

        this.getSelectedIds = function () {
            return this.teamIds('a').concat(this.teamIds('b'));
        };

        this.exportUsers = function (data, teamIndex) {
            var users = [];

            angular.forEach(data['games_users_' + teamIndex], function(game_user) {
                this.push(game_user.user);
            }, users);

            return users;
        };

        this.setData = function(data) {
            $this.users = {
                a: $this.exportUsers(data, 'a'),
                b: $this.exportUsers(data, 'b')
            };
            $this.points = {
                a: data.team_a_points,
                b: data.team_b_points
            };
            $this.playedAt = transformDate(new Date(data.played_at));
            $this.id = data.id;
        };

        this.getFormData = function () {
            return {
                games_users_a: $this.teamIds('a'),
                team_a_points: $this.points.a,
                games_users_b: $this.teamIds('b'),
                team_b_points: $this.points.b,
                played_at: $this.playedAt
            }
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    CreateGameService.prototype.MAX_POINTS = 10;
    CreateGameService.prototype.MIN_POINTS = 0;

    return CreateGameService;
}]);