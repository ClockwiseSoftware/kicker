(function (app) {
  app.factory('Player', ['$resource',
    function ($resource) {
      return $resource('/api/users/me', {id: '@id', params: '@params'}, {
        me: {
          method: 'GET',
          isArray: false
        },
        get: {
          method: 'GET',
          url: 'api/users'
        },
        update: {
          method: 'PUT',
          url: 'api/users/:id'
        },
        delete: {
          method: 'DELETE',
          url: 'api/users/:id',
          isArray: true
        },
        restore: {
          method: 'POST',
          url: 'api/users/:id/restore'
        }
      });
    }]);
})(angular.module('kickerApp'));