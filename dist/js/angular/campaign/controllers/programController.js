(function () {
    'use strict';

    angular.module('olh-lps-campaign')
        .controller('ProgramController',
            [
                '$scope', 'ProgramService',
                function ($scope, ProgramService) {
                    $scope.programs = ProgramService.getPrograms().slice(1);
                }
            ]
        );
})();
