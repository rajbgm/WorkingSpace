(function () {
  'use strict';

  angular.module('olh-lps-member')
    .controller('MemberMessageController', [
      '$scope', 'MemberMessageService',
      function ($scope, MemberMessageService) {
        $scope.successfulMessages = MemberMessageService.getSuccessfulMessages();

        $scope.systemMessages = MemberMessageService.getSystemMessages();

        $scope.allMessages = $scope.successfulMessages.concat($scope.systemMessages);
      }
    ]);
})();
