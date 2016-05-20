app.controller('UserProfileCtrl', [
  '$scope', '$http', '$timeout',
  '$mdToast', '$mdDialog', 'Upload',
  'Player',
  function ($, $http, $timeout, $mdToast, $mdDialog, Upload, Player) {
    $.player = null;
    $.errors = {};
    $.loading = true;

    $.openDialog = function openDialog(ev) {
      var confirm = $mdDialog.confirm()
        .title('Do you really want to delete your profile?')
        .targetEvent(ev)
        .ok('Delete')
        .cancel('Cancel');

      $mdDialog.show(confirm)
        .then(function() {
          $.deletePlayer($.player);
        });
    };

    Player.me().$promise
      .then(function (player) {
        $.loading = false;
        $.player = player;
      });

    $.deletePlayer = function (player) {
      Player.delete({id: player.id}).$promise
        .then(function () {
          window.location.href = '/logout';
        });
    };

    $.saveChanges = function (player) {
      $.errors = {};
      $.loading = true;

      Player.update({id: $.player.id}, player).$promise
        .then(function (res) {
          $.loading = false;
          showAlert();
        })
        .catch(function (res) {
          $.loading = false;
          $.errors = res.data;
        });
    };

    $.$watch('avatar', function () {
      $.upload($.avatar);
    });

    $.upload = function (avatar) {
      $.errors = {};
      if (avatar && !avatar.$error) {
        Upload.upload({
          url: '/user/' + $.player.id + '/avatar',
          data: {
            avatar: avatar
          }
        }).then(function (res) {
          $.player.avatar_url = res.data.avatar + '?' + (new Date()).getTime();
          showAlert();
        }).catch(function (res) {
          $.errors = res.data;
        });
      }
    };

    function showAlert() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Changes have been saved!')
          .position('bottom right')
          .hideDelay(2000)
      );
    }
  }
]);