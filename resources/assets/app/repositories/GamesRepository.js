app.factory('GamesRepository', ['$http', 'Game', function($http, Game) {
    function GamesRepository() {
        var self = this;

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
            angular.forEach(data, function(data) {
                var game = new Game(data);
                this.push(game);

                indexesMap[game.id] = this.length - 1;
            }, self.storage);
        };

        this.get = function (id) {
            var storageIndex = indexesMap[id];

            if (self.storage.hasOwnProperty(storageIndex))
                return self.storage[storageIndex];

            return null;
        };

        this.update = function (id, data) {
            var game = self.get(id);
            angular.copy(new Game(data), game);

            return game;
        };

        this.load = function (flush) {
            if (flush) {
                // Flush all games and their data
                self.currentpage = 0;
            } else {
                self.currentpage++;
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

            self.loading = true;
            $http({
                url: '/',
                method: 'GET',
                params: data
            }).success(function(response) {
                if (flush) {
                    self.storage.splice(0, self.storage.length);
                }

                if (response.data.length > 0) {
                    self.currentpage = response.current_page;
                    self.lastpage = response.last_page;

                    self.add(response.data);
                }

                self.loading = false;
            });
        };

        return this;
    }

    return GamesRepository;
}]);