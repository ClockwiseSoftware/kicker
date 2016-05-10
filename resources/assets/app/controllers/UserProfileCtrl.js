app.controller('UserProfileCtrl', [
  '$scope', '$http', '$timeout',
  'ngDialog', 'Upload', 'Player',
  function ($scope, $http, $timeout, ngDialog, Upload, Player) {
    $scope.player = null;
    $scope.errors = {};
    $scope.loading = true;
    $scope.showAlert = false;

    $scope.openDialog = function openDialog() {
      ngDialog.open({
        template: 'delete-confirmation',
        scope: $scope
      });
    };

    Player.me().$promise
      .then(function (player) {
        $scope.loading = false;
        $scope.player = player;
      });

    $scope.deletePlayer = function (player) {
      Player.delete({id: player.id}).$promise
        .then(function () {
          window.location.href = '/logout';
        });
    };

    $scope.saveChanges = function (player) {
      $scope.errors = {};
      $scope.loading = true;

      Player.update({id: $scope.player.id}, player).$promise
        .then(function (res) {
          $scope.loading = false;
          showAlert();
        })
        .catch(function (res) {
          $scope.loading = false;
          $scope.errors = res.data;
        });
    };

    $scope.$watch('avatar', function () {
      $scope.upload($scope.avatar);
    });

    $scope.upload = function (avatar) {
      $scope.errors = {};
      if (avatar && !avatar.$error) {
        Upload.upload({
          url: '/user/' + $scope.player.id + '/avatar',
          data: {
            avatar: avatar
          }
        }).then(function (res) {
          $scope.player.avatar_url = res.data.avatar + '?' + (new Date()).getTime();
          showAlert();
        }).catch(function (res) {
          $scope.errors = res.data;
        });
      }
    };

    function showAlert() {
      $scope.showAlert = true;

      $timeout(function () {
        $scope.showAlert = false;
      }, 2000);
    }
  }
]);