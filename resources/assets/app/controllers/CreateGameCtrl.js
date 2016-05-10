app.controller('CreateGameCtrl', [
  '$scope', '$http', '$location',
  '$filter', 'ngDialog', 'Player',
  'Match', 'CreateGameService',
  function ($scope, $http, $location, $filter, ngDialog, Player, Match, CreateGameService) {
    $scope.loading = false;
    $scope.errors = {};
    $scope.points = _.range(0, 10);
    $scope.players = [];
    $scope.game = new CreateGameService();

    var activeTeam = null;
    $scope.setActiveTeam = function setActiveTeam(team) {
      activeTeam = team;
    };

    var activeIndex = null;
    $scope.setActiveIndex = function setActiveTeam(index) {
      activeIndex = index;
    };

    $scope.openDialog = function openDialog() {
      ngDialog.open({
        template: 'delete-confirmation',
        scope: $scope
      });
    };

    $scope.selectPlayer = function selectPlayer(playerId) {
      playerId = parseInt(playerId);
      var player = _.find($scope.players, function (player) { return player.id === playerId; });
      player.selected = true;

      var prevPlayer = $scope.game.players[activeTeam][activeIndex];
      if (prevPlayer && prevPlayer.hasOwnProperty('id')) {
        prevPlayer.selected = false;
      }

      $scope.game.players[activeTeam][activeIndex] = player;
      $scope.game.validate();
    };
    
    $scope.createGame = function createGame() {
      Match.create({}, $scope.game.getFormData()).$promise
        .then(function () {
          $scope.loading = false;
          $location.path('/');
        });
    };

    Player.get({exceptIds: $scope.selectedPlayersIds}).$promise
      .then(function (res) {
        $scope.players = res.data;
        _.each($scope.players, function (player) {
          player.selected = false;
          player.avatar_url = player.avatar_url ? player.avatar_url : '/img/no-avatar.min.png';
        });
      })
      .catch(function (res) {
        c$scope.errors = res
      });

    var $playedAt = $('#played-at');
    $playedAt.datetimepicker({
      format: 'MM/DD/YYYY HH:mm',
      maxDate: (new Date())
    });
    $playedAt.on('dp.change', function() {
      $scope.game.playedAt = $(this).val();
    });
  }
]);