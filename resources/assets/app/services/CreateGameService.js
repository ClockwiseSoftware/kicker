app.factory('CreateGameService', ['$http', '$filter', function ($http, $filter) {
  function CreateGameService(data) {
    var _this = this;

    _this.isValid = false;
    _this.id = null;
    _this.players = {
      winners: [{}, {}],
      losers: [{}, {}]
    };
    _this.points = {
      winners: 10,
      losers: 0
    };
    _this.activeTeam = null;
    _this.activeIndex = null;

    _this.setActiveTeam = function setActiveTeam(team) {
      _this.activeTeam = team;
    };

    _this.setActiveIndex = function setActiveTeam(index) {
      _this.activeIndex = index;
    };

    _this.getSelectedPlayerIds = function getSelectedPlayerIds() {
      var winnersIds = _.pluck(_this.players.winners, 'id');
      var losersIds = _.pluck(_this.players.losers, 'id');

      return winnersIds.concat(losersIds);
    };

    _this.playedAt = transformDate(new Date());

    _this.setData = function (data) {
      _this.players = {
        winners: exportUsers(data, 'winners'),
        losers: exportUsers(data, 'losers')
      };
      _this.points = {
        winners: data.team_a_points,
        losers: data.team_b_points
      };
      _this.playedAt = transformDate(Date.parseISO(data.played_at));
      _this.id = data.id;
    };

    _this.getFormData = function () {
      return {
        games_users_a: _.pluck(_this.players.winners, 'id'),
        team_a_points: _this.points.winners,
        games_users_b: _.pluck(_this.players.losers, 'id'),
        team_b_points: _this.points.losers,
        played_at: _this.playedAt
      }
    };

    _this.validate = function validate() {
      var valid = true;

      // Validate Players
      _.each(_this.players, function (players, team) {
        for (var index in players) {
          if (!players[index].hasOwnProperty('id'))
            valid = false;
        }
      });

      // Validate Date
      if (!_this.playedAt)
        valid = false;

      _this.isValid = valid;
      return _this.isValid;
    };

    function transformDate(date) {
      return $filter('date')(date, 'MM/dd/yyyy HH:mm');
    }

    function exportUsers(data, team) {
      var users = [];
      var teamIndex = team === 'winners' ? 'a' : 'b';

      angular.forEach(data['games_users_' + teamIndex], function(game_user) {
        game_user.user.avatar_url = game_user.user.avatar_url ? game_user.user.avatar_url : '/img/no-avatar.min.png';
        this.push(game_user.user);
      }, users);

      return users;
    }

    if (data) {
      _this.setData(data);
    }

    return this;
  }

  return CreateGameService;
}]);