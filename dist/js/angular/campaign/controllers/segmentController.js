(function () {
  'use strict';

  angular.module('olh-lps-campaign')
    .controller('SegmentController', [
        '$scope', 'SegmentService',
        function ($scope, SegmentService) {
          $scope.segments = SegmentService.getSegments();
        }
      ]
    );
})();
