(function (app) {
  app.directive('windowBottom', ['$window', function ($window) {
    return {
      restrict: 'A',
      scope: {
        windowBottom: '&'
      },
      link: function (scope, element, attr) {
        angular.element($window).bind('scroll', function () {
          var windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
          var body = document.body;
          var html = document.documentElement;
          var docHeight = Math.max(
            body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight
          );
          var windowBottom = windowHeight + window.pageYOffset;

          if (windowBottom >= docHeight) {
            scope.windowBottom();
          }
        });
      }
    };
  }]);
})(angular.module('kickerApp'));