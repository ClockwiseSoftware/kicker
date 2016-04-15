app.factory('CreateGameService', ['$http', '$filter', function($http, $filter) {
    function CreateGameService(data) {
        this.users = {
            a: [],
            b: []
        };
        this.points = {
            a: 0,
            b: 0
        };
        this.playedAt = (function(date) {
            return $filter('date')(date, 'MM/dd/yyyy HH:mm');
        })(new Date());

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

        this.setData = function(data) {
            angular.extend(this, data);
        };

        if (data) {
            this.setData(data);
        }

        return this;
    }

    return CreateGameService;
}]);