(function () {
    'use strict';

    angular.module('olh-lps-campaign')
        .controller('CampaignController',
            [
                '$scope', 'SegmentService', 'ProgramService',
                function ($scope, SegmentService, ProgramService) {
                    $scope.segments = SegmentService.getSegments().slice(2, 7);
                    $scope.selectedSegments = SegmentService.getSegments().slice(0, 2);

                    $scope.programs = ProgramService.getPrograms().slice(1);
                    $scope.selectedPrograms = ProgramService.getPrograms().slice(0, 1);
                }
            ]
        );
})();
