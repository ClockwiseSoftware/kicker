(function (app) {
  app.factory('Match', ['$resource',
    function ($resource) {
      return $resource('game', {}, {
        create: {
          method: 'POST'
        }
      });
    }]);
})(angular.module('kickerApp'));