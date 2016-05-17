app.controller('GamesCtrl', [
  '$scope', '$rootScope', '$http',
  '$window', 'Game', 'GamesRepository',
  function ($, $rootScope, $http, $window, Game, GamesRepository) {
    $.gamesRepository = new GamesRepository();
    $.games = $.gamesRepository.storage;

    $.gamesRepository.load();

    $.loadMore = function () {
      if ($.gamesRepository.currentpage < $.gamesRepository.lastpage) {
        $.$emit('startLoading');
        $.gamesRepository.load().then(function () {
          $.$emit('finishLoading');
        });
      }
    };

    // @TODO encapsulate it somewhere
    $.user = {
      isGuest: false,
      isUser: false,
      isAdmin: false
    };
    function getUserRole() {
      $http({
        url: '/user/role',
        method: 'GET'
      }).success(function (role) {
        if (role === 'guest') {
          $.user.isGuest = true;
        } else if (role === 'user') {
          $.user.isUser = true;
        } else if (role === 'admin') {
          $.user.isAdmin = true;
        }
      });
    }

    $.userRole = getUserRole();

    $.complain = function (id) {
      var game = $.gamesRepository.get(id);
      game.loading = true;

      $http.get('/game/' + id + '/complain')
        .success(function (response) {
          $http.get('/game/' + id)
            .success(function (response) {
              game.loading = false;
              $.gamesRepository.update(response.id, response);
            });
        });
    };
  }
]);