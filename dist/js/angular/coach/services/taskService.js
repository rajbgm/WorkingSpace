(function () {
  'use strict';

  angular.module('olh-lps-coach')
    .service('TaskService', [
      function () {
        return {
          getCoachTasks: function () {
            return [
              {
                id: 1, description: 'Initial Outreach Call.',
                isCall: true,
                member: {
                  id: 484490,
                  lastName: 'dudani',
                  firstName: 'jaideep'
                }
              },
              {
                id: 2,
                description: 'Progress Support Call',
                isCall: true,
                member: {
                  id: 494079,
                  lastName: 'balboa',
                  firstName: 'louis'
                }
              },
              {
                id: 3,
                description: 'Progress Appointment Call.',
                isCall: true,
                member: {
                  id: 45089,
                  lastName: 'valadez',
                  firstName: 'aurora'
                }
              },
              {
                id: 4,
                description: 'Return Voicemail',
                isCall: true,
                member: {
                  id: 245622,
                  lastName: 'weissman',
                  firstName: 'anna l'
                }
              },
              {
                id: 5,
                description: 'Initial Outreach Message',
                member: {
                  id: 119441,
                  lastName: 'monreal',
                  firstName: 'lisa'
                }
              },
              {
                id: 6,
                description: 'Progress Appointment Message',
                member: {
                  id: 573494,
                  lastName: 'cross',
                  firstName: 'melody'
                }
              },
              {
                id: 7,
                description: 'Progress Support Message',
                member: {
                  id: 415732,
                  lastName: 'phillips',
                  firstName: 'raymond'
                }
              },
              {
                id: 8,
                description: 'Initial Outreach Call.',
                isCall: true,
                member: {
                  id: 80027,
                  lastName: 'gibson',
                  firstName: 'megan'
                }
              },
              {
                id: 9,
                description: 'Progress Appointment Call.',
                isCall: true,
                member: {
                  id: 406692,
                  lastName: 'lewis',
                  firstName: 'sharon'
                }
              },
              {
                id: 10,
                description: 'Progress Support Call',
                isCall: true,
                member: {
                  id: 143298,
                  lastName: 'hoosier',
                  firstName: 'james'
                }
              }
            ];
          }
        };
      }
    ]);
})();
