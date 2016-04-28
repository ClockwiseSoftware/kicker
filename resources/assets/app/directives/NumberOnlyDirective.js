(function (app) {
    app.directive('numberOnly', function() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, modelCtrl) {
                modelCtrl.$parsers.push(function (text) {
                    var temp = parseInt(text),
                        min = parseInt(attr.min),
                        max = parseInt(attr.max),
                        result = min;

                    if (temp > max) {
                        result = max;
                    } else if (temp >= min) {
                        result = temp;
                    } else {
                        result = min;
                    }

                    modelCtrl.$setViewValue(result);
                    modelCtrl.$render();

                    return result;
                });
            }
        };
    });
})(angular.module('kickerApp'));