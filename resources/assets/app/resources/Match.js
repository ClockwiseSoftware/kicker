(function (app) {
  app.factory('Match', ['$resource',
    function ($resource) {
      return $resource('/api/games/:id', {id: '@id'}, {
        create: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      });
    }]);
})(angular.module('kickerApp'));