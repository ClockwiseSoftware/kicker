app.controller('CreateGameCtrl', [
  '$scope', '$http', '$location',
  '$filter', '$timeout', 'ngDialog',
  'Player', 'Match', 'CreateGameService',
  function ($, $http, $location, $filter, $timeout, ngDialog, Player, Match, CreateGameService) {
    $.loading = false;
    $.errors = {};
    $.points = _.range(0, 10);
    $.players = [];
    $.game = new CreateGameService();

    $.openDialog = function openDialog() {
      ngDialog.open({
        template: 'html/dialogues/select-player.html',
        scope: $,
        closeByNavigation: true
      });
    };

    $.selectPlayer = function selectPlayer(playerId) {
      playerId = parseInt(playerId);
      var player = _.find($.players, function (player) {
        return player.id === playerId;
      });
      player.selected = true;

      var prevPlayer = $.game.players[$.game.activeTeam][$.game.activeIndex];
      if (prevPlayer && prevPlayer.hasOwnProperty('id')) {
        prevPlayer.selected = false;
      }

      $.game.players[$.game.activeTeam][$.game.activeIndex] = player;
      $.game.validate();
    };

    $.orderPlayers = function (player) {
      if ($.currentPlayer.id == player.id)
        return 1;

      return player.name;
    };

    $.createGame = function createGame() {
      var timeoutId = $timeout(function () {
        $.loading = true;
      }, 500);

      Match.create({}, $.game.getFormData()).$promise
        .then(function () {
          $timeout.cancel(timeoutId);
          $.loading = false;

          $location.path('/');
        })
        .catch(function (res) {
          $timeout.cancel(timeoutId);
          $.loading = false;

          if (res.status === 422) {
            $.errors = res.data;
          } else {
            $.errors = {
              text: ['Something terrible has happened. Please, try again later!']
            };
          }
        });
    };

    Player.get().$promise
      .then(function (res) {
        $.players = res.data;
        _.each($.players, function (player) {
          player.selected = false;
          player.avatar_url = player.avatar_url ? player.avatar_url : '/img/no-avatar.min.png';
        });
      });

    var $playedAt = jQuery('#played-at');
    $playedAt.datetimepicker({
      format: 'MM/DD/YYYY HH:mm',
      maxDate: (new Date())
    });
    $playedAt.on('dp.change', function() {
      $.game.playedAt = jQuery(this).val();
    });
  }
]);