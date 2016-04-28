(function (app) {
    app.factory('Player', ['$resource',
        function($resource) {
            return $resource('user/me', {}, {
                get: {
                    method: 'GET',
                    isArray: false
                }
            });
        }]);
})(angular.module('kickerApp'));