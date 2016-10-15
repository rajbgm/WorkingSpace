(function () {
  'use strict';

  angular.module('olh-lps-coach')
    .controller('MessageController', [
      '$scope', 'MessageService',
      function ($scope, MessageService) {
        $scope.messages = MessageService.getInboundMessages();
      }
    ]);
})();
