app.factory('GamesRepository', ['$http', 'Game', function ($http, Game) {
  function GamesRepository() {
    var _this = this;

    this.storage = [];
    this.loading = true;
    this.lastpage = 0;
    this.currentpage = 0;
    this.filters = {
      page: this.currentpage,
      usersGames: false
    };

    var indexesMap = {};

    this.add = function (data) {
      angular.forEach(data, function (data) {
        var game = new Game(data);
        this.push(game);

        indexesMap[game.id] = this.length - 1;
      }, _this.storage);
    };

    this.get = function (id) {
      var storageIndex = indexesMap[id];

      if (_this.storage.hasOwnProperty(storageIndex))
        return _this.storage[storageIndex];

      return null;
    };

    this.update = function (id, data) {
      var game = _this.get(id);
      angular.copy(new Game(data), game);

      return game;
    };

    this.load = function (flush) {
      if (flush) {
        // Flush all games and their data
        _this.currentpage = 0;
      } else {
        _this.currentpage++;
      }

      var data = (function (data) {
        var copy = {};

        for (var prop in data) {
          if (!data.hasOwnProperty(prop))
            continue;

          copy[prop] = data[prop];

          if (typeof(copy[prop]) === 'boolean') {
            copy[prop] *= 1;
          }
        }

        return copy;
      })(this.filters);

      data.page = this.currentpage;
      _this.loading = true;
      return $http({
        url: '/',
        method: 'GET',
        params: data
      }).success(function (response) {
        if (flush) {
          _this.storage.splice(0, _this.storage.length);
        }

        if (response.data.length > 0) {
          _this.currentpage = response.current_page;
          _this.lastpage = response.last_page;

          _this.add(response.data);
        }

        _this.loading = false;
      });
    };

    return this;
  }

  return GamesRepository;
}]);