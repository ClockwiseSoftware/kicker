app.controller('CreateGameCtrl', [
  '$scope', '$http', '$location',
  '$filter', 'ngDialog', 'Player',
  'Match', 'CreateGameService',
  function ($, $http, $location, $filter, ngDialog, Player, Match, CreateGameService) {
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
    
    $.createGame = function createGame() {
      Match.create({}, $.game.getFormData()).$promise
        .then(function () {
          $.loading = false;
          $location.path('/');
        })
        .catch(function (res) {
          $.errors = res.data;
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