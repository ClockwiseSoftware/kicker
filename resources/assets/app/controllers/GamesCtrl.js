app.controller(
  'GamesCtrl', 
  [ '$scope', 
    '$rootScope', 
    '$http', 
    '$timeout', 
    'Game',
    'GamesRepository',
    "UserComplain",
    '$route',
    function ($, $rootScope, $http, $timeout, Game, GamesRepository, UserComplain, $route) {
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

      $.delete = function (id) {
        $http.delete('/api/games/' + id)
          .success(function () {
            $route.reload();
          });
      };

      $.showOlnlyMyGames = function showOlnlyMyGames() {
        $timeout(function () {
          $.gamesRepository.load(true);
        }, 100);
      };

      $.complain = 
          function (id, pEv) {

              $timeout(
                  function () {

                    var game = $.gamesRepository.get(id);
                    game.loading = true;

                    var updateGame = function(response) {
                        $http
                            .get('/api/games/' + id)
                            .success(function (response) {
                                game.loading = false;
                                $.gamesRepository
                                    .update(
                                        response.id,
                                        response);
                            });
                    };

                    var addComplain =
                          function(game_id, pData) {
                            pUrl = '/api/games/'+game_id+'/complain';
                            $http
                              .post(pUrl, {'reason': pData})
                              .success(
                                  function(response) {
                                      updateGame(response);

                              });
                          };

                    var removeComplain = function (game_id) {
                        pUrl = '/api/games/'+game_id+'/complain';
                        $http
                            .delete(pUrl)
                            .success(
                                function(response) {
                                    updateGame(response);

                                });
                    };

                    if(game.isComplainedByUser($rootScope.currentPlayer)) {
                        removeComplain(id);
                    }
                    else {
                      UserComplain.show(
                        {   event: pEv,
                            offsX: -40,
                            offsY: -40,
                            onOk: function(pData) {
                                addComplain(id, pData);
                                UserComplain.hide();
                            },
                            onClose: function() {
                              game.loading = false;
                            }
                        });
                    }
                  }, 
                  100);
      };
    }
  ]);