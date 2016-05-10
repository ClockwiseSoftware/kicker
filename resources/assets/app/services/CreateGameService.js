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

    function transformDate(date) {
      return $filter('date')(date, 'MM/dd/yyyy HH:mm');
    }

    _this.playedAt = transformDate(new Date());
    _this.setData = function (data) {};

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

    if (data) {
      _this.setData(data);
    }

    return this;
  }

  CreateGameService.prototype.MAX_POINTS = 10;
  CreateGameService.prototype.MIN_POINTS = 0;

  return CreateGameService;
}]);