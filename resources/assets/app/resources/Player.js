(function (app) {
  app.factory('Player', ['$resource',
    function ($resource) {
      return $resource('/api/user/me', {id: '@id', params: '@params'}, {
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
          url: 'api/user/:id'
        },
        delete: {
          method: 'DELETE',
          url: 'api/user/:id',
          isArray: true
        },
        restore: {
          method: 'POST',
          url: 'api/user/:id/restore'
        }
      });
    }]);
})(angular.module('kickerApp'));