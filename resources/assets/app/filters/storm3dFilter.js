(function (app) {
  app.filter('storm3dFilter', function stormFilter() {
    return function (array, userId) {
      var index;

      if (userId != 13)
        return array;

      for (index in array) {
        if (!array.hasOwnProperty(index))
          continue;

        if (array[index] && array[index].id == userId) {
          var item = array[index];
          array.splice(index, 1);
          array.splice(2, 0, item);
          break;
        }
      }

      return array;
    };
  });
})(angular.module('kickerApp'));