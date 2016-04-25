app.factory('GamesRepository', ['$http', 'Game', function($http, Game) {
    function GamesRepository() {
        this.storage = [];
        this.loading = true;
        this.lastpage = 0;
        this.currentpage = 0;

        var self = this,
            indexesMap = {};

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

        this.load = function (callback) {
            self.loading = true;

            $http({
                url: '/',
                method: 'GET',
                params: {
                    page: (self.currentpage + 1)
                }
            }).success(function(response) {
                if (response.data.length > 0) {
                    self.currentpage = response.current_page;
                    self.lastpage = response.last_page;

                    self.add(response.data);
                }

                self.loading = false;
            });

            if (callback)
                callback.call();
        };

        return this;
    }

    return GamesRepository;
}]);