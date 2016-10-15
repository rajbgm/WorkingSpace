(function () {
  'use strict';

  angular.module('olh-lps-coach')
    .controller('TaskController', [
      '$scope', 'TaskService',
      function ($scope, TaskService) {
        $scope.pendingTasks = TaskService.getCoachTasks();
      }
    ]);
})();
