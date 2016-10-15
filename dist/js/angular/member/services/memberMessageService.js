(function () {
  'use strict';

  angular.module('olh-lps-member')
    .service('MemberMessageService', [
      function () {
        return {
          getSuccessfulMessages: function () {
            return [
              {
                senderName: 'Wayne',
                description: 'Outreach voice call to Louis.',
                isVoice: true,
                senderIconSrc: 'user2-160x160.jpg',
                timeStamp: '10 Oct 2:20 pm'
              },
              {
                senderName: 'Louis',
                description: 'Inbound call from Louis.',
                isVoice: true,
                senderIconSrc: 'user1-128x128.jpg',
                timeStamp: '10 Oct 2:00 pm',
                self: true
              }
            ]
          },
          getSystemMessages: function () {
            return [];
          }
        };
      }
    ]);
})();
