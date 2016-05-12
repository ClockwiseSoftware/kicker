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
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm)
        .then(function() {
          $.deletePlayer($.player);
        });
    };

    $.showConfirm = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete your debt?')
        .textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Please do it!')
        .cancel('Sounds like a scam');

      $mdDialog.show(confirm).then(function() {
        $.status = 'You decided to get rid of your debt.';
      }, function() {
        $.status = 'You decided to keep your debt.';
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