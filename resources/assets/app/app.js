var app = angular
    .module('kickerApp', [])
    .config(['$httpProvider', '$interpolateProvider',
        function ($httpProvider, $interpolateProvider) {
            $interpolateProvider.startSymbol('<%');
            $interpolateProvider.endSymbol('%>');
            // $httpProvider.defaults.headers
            //     .common['X-Requested-With'] = 'XMLHttpRequest';
        }
    ]);