(function (app) {
  app.factory('Player', ['$resource',
    function ($resource) {
      return $resource('user/me', {id: '@id'}, {
        get: {
          method: 'GET',
          isArray: false
        },
        update: {
          method: 'PUT',
          url: 'user/:id'
        },
        delete: {
          method: 'DELETE',
          url: 'user/:id',
          isArray: true
        },
        restore: {
          method: 'POST',
          url: 'user/:id/restore'
        }
      });
    }]);
})(angular.module('kickerApp'));