app.controller(
  'GamesCtrl', 
  [ '$scope', 
    '$rootScope', 
    '$http', 
    '$timeout', 
    'Game',
    'GamesRepository',
    "UserComplain",
    function ($, $rootScope, $http, $timeout, Game, GamesRepository, UserComplain) {
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

      $.showOlnlyMyGames = function showOlnlyMyGames() {
        $timeout(function () {
          $.gamesRepository.load(true);
        }, 100);
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

      $.complain = 
          function (id, pEv) {

              $timeout(
                  function () {

                    var game = $.gamesRepository.get(id);
                    game.loading = true;

                    var makeReq = 
                          function(pUrl) {
                            $http
                              .get(pUrl)
                              .success(
                                  function(response) {
                                      $http
                                          .get('/game/' + id)
                                          .success(function (response) {
                                              game.loading = false;
                                              $.gamesRepository
                                                .update(
                                                    response.id, 
                                                    response);
                                  });
                              });
                          };

                    if(game.isComplainedByUser($rootScope.currentPlayer)) {
                        makeReq('/game/'+id+'/ /complain');
                    }
                    else {
                      UserComplain.show(
                        {   event: pEv,
                            offsX: -40,
                            offsY: -40,
                            onOk: function(pData) {

                                makeReq('/game/'+id+'/'+pData+'/complain');
                                UserComplain.hide();

                                // $http
                                //     .get('/game/'+id+'/'+pData+'/complain')
                                //     .success(
                                //         function(response) {
                                //             $http
                                //                 .get('/game/' + id)
                                //                 .success(function (response) {
                                //                     game.loading = false;
                                //                     $.gamesRepository
                                //                       .update(
                                //                           response.id, 
                                //                           response);
                                //         });
                                //     });

                                // console.log(pData);
                                // game.loading = false;

                                
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