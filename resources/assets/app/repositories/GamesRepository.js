app.factory('GamesRepository', ['$http', 'Game', function($http, Game) {
    function GamesRepository() {
        this.storage = [];
        this.loading = true;
        this.lastpage = 0;
        this.currentpage = 0;

        var $this = this,
            indexesMap = {};

        this.add = function (data) {
            angular.forEach(data, function(data) {
                var game = new Game(data);
                this.push(game);

                indexesMap[game.id] = this.length - 1;
            }, $this.storage);
        };

        this.get = function (id) {
            var storageIndex = indexesMap[id];

            if ($this.storage.hasOwnProperty(storageIndex))
                return $this.storage[storageIndex];

            return null;
        };

        this.update = function (id, data) {
            var game = $this.get(id);
            angular.copy(new Game(data), game);

            return game;
        };

        this.load = function (callback) {
            $this.loading = true;

            $http({
                url: '/',
                method: 'GET',
                params: {
                    page: ($this.currentpage + 1)
                }
            }).success(function(response) {
                if (response.data.length > 0) {
                    $this.currentpage = response.current_page;
                    $this.lastpage = response.last_page;

                    $this.add(response.data);
                }

                $this.loading = false;
            });

            if (callback)
                callback.call();
        };

        return this;
    }

    return GamesRepository;
}]);