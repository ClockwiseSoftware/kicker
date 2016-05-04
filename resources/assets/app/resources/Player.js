(function (app) {
    app.factory('Player', ['$resource',
        function($resource) {
            return $resource('user/me', {id: '@id'}, {
                get: {
                    method: 'GET',
                    isArray: false
                },
                update: {
                    method: 'PUT',
                    url: 'user/:id'
                }
            });
        }]);
})(angular.module('kickerApp'));