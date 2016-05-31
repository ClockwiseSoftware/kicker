app.factory('GameUser', ['$http', 'User', function ($http, User) {
  function GameUser(data) {
    var _this = this;

    this.setData = function (data) {
      angular.extend(this, data);

      _this.user = new User(_this.user);
    };

    this.getDelta = function () {
      return _this.rating_after - _this.rating_before;
    };

    this.userPointsClass = function () {
      return _this.getDelta() >= 0 ? 'win' : 'lose';
    };

    if (data) {
      this.setData(data);
    }

    return this;
  }

  return GameUser;
}]);