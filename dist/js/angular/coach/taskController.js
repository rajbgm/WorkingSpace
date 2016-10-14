(function () {
  'use strict';
  angular.module('olh-lps-coach')
    .controller('TaskController', [
        '$scope',
        function ($scope) {
          $scope.taskName = 'Test Task';

          $scope.pendingTasks = [
            {id: 1, description: 'Initial Outreach Call. Also, Initial Outreach Call – Second Attempt', isCall: true},
            {id: 2, description: 'Progress Appointment Call. Also, Progress Appointment Call – Second Attempt', isCall: true},
            {id: 3, description: 'Progress Support Call', isCall: true},
            {id: 4, description: 'Return Voicemail', isCall: true},
            {id: 5, description: 'Initial Outreach Message'},
            {id: 6, description: 'Progress Appointment Message'},
            {id: 7, description: 'Progress Support Message'},
            {id: 8, description: 'Initial Outreach Call. Also, Initial Outreach Call – Second Attempt', isCall: true},
            {id: 9, description: 'Progress Appointment Call. Also, Progress Appointment Call – Second Attempt', isCall: true},
            {id: 10, description: 'Progress Support Call', isCall: true},
            {id: 11, description: 'Return Voicemail', isCall: true},
            {id: 12, description: 'Initial Outreach Message'},
            {id: 13, description: 'Progress Appointment Message'},
            {id: 14, description: 'Progress Support Message'},
            {id: 15, description: 'Initial Outreach Call. Also, Initial Outreach Call – Second Attempt', isCall: true},
            {id: 16, description: 'Progress Appointment Call. Also, Progress Appointment Call – Second Attempt', isCall: true},
            {id: 17, description: 'Progress Support Call', isCall: true},
            {id: 18, description: 'Return Voicemail', isCall: true},
            {id: 19, description: 'Initial Outreach Message'},
            {id: 20, description: 'Progress Appointment Message'},
            {id: 21, description: 'Progress Support Message'},
            {id: 22, description: 'Initial Outreach Call. Also, Initial Outreach Call – Second Attempt', isCall: true},
            {id: 23, description: 'Progress Appointment Call. Also, Progress Appointment Call – Second Attempt', isCall: true},
            {id: 24, description: 'Progress Support Call', isCall: true},
            {id: 25, description: 'Return Voicemail', isCall: true},
            {id: 26, description: 'Initial Outreach Message'},
            {id: 27, description: 'Progress Appointment Message'},
            {id: 28, description: 'Progress Support Message'},
            {id: 29, description: 'Initial Outreach Call. Also, Initial Outreach Call – Second Attempt', isCall: true},
            {id: 30, description: 'Progress Appointment Call. Also, Progress Appointment Call – Second Attempt', isCall: true},
            {id: 31, description: 'Progress Support Call', isCall: true},
            {id: 32, description: 'Return Voicemail', isCall: true}
          ];
        }
      ]
    );
})();
