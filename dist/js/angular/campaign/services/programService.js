(function () {
    'use strict';

    angular.module('olh-lps-campaign')
        .service('ProgramService', [
            function () {
                return {
                    getPrograms: function () {
                        return [
                            {
                                header: 'Fall Program',
                                content: 'Fall Program'
                            },
                            {
                                header: 'Weight Loss',
                                content: 'Weight Loss Program'
                            },
                            {
                                header: 'Stress Reduction',
                                content: 'Stress Reduction Program'
                            }
                        ]
                    }
                };
            }
        ]);
})();
