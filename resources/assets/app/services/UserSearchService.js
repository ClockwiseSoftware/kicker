app.factory('UserSearch', ['$http', function($http) {
    function UserSearch() {}

    UserSearch.find = function(search, $scope) {
        if ($scope.searchRequestPending || $scope.game === null)
            return false;

        $scope.searchRequestPending = true;

        var exceptIds = $scope.game.getSelectedIds(),
            params = {};
        search = search ? search.trim() : search;

        if (exceptIds.length > 0)
            params['exceptIds[]'] = exceptIds;
        if (search)
            params.search = search;


        return $http.get('/user/search', {
            params: params
        }).then(function(response) {
            if (response.data.length === 0) {
                $scope.usersSearch = [{name: 'No results...'}];
            } else {
                $scope.usersSearch = response.data;
            }

            $scope.searchRequestPending = false;
        });
    };

    UserSearch.remove = function (user, $scope) {
        for (var i = 0; i < $scope.usersSearch.length; i++) {
            if (user.id === $scope.usersSearch[i].id) {
                $scope.usersSearch.splice(i, 1);
                break;
            }
        }
    };

    UserSearch.add = function (user, $scope) {
        $scope.usersSearch.unshift(user);
    };

    return UserSearch;
}]);