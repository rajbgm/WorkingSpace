(function () {
  'use strict';

  angular.module('olh-lps-coach')
    .service('MessageService', [
      function () {
        return {
          getInboundMessages: function () {
            return [
              {
                id: 1,
                memberName: 'Balboa, Louis',
                description: 'Voice Message from Member',
                isCall: true,
                duration: 5,
                durationType: 'mins'
              },
              {
                id: 2,
                memberName: 'Harrell, Marcelino',
                description: 'Voice Message from Member',
                isCall: true,
                duration: 10,
                durationType: 'mins'
              },
              {
                id: 3,
                memberName: 'Talley, Jacob',
                description: 'Voice Message from Member',
                isCall: true,
                duration: 15,
                durationType: 'mins'
              },
              {
                id: 4,
                memberName: 'Astair, Fred',
                description: "We miss you! It's been a while since we've seen any fitness activity from your connected activity tracker. Did you know it only takes 5000 steps a day to see health benefits? It's that easy!",
                isCall: false,
                isSecure: true,
                duration: 2,
                durationType: 'days'
              },
              {
                id: 5,
                memberName: 'Mattingley, Scott',
                description: "Don't wait any longer and start using your tracker again today!",
                isCall: false,
                isSecure: true,
                duration: 3,
                durationType: 'days'
              },
              {
                id: 6,
                memberName: 'Aagard, Darin',
                description: "Need help getting back on track? Call 877-620-2232 and our team will be happy to help answer any questions you have about your activity tracker or provide the motivation you need to get back on track today!",
                isCall: false,
                isSecure: true,
                duration: 5,
                durationType: 'days'
              },
              {
                id: 7,
                memberName: 'Aaron, Jennifer',
                description: "Welcome back!  If you haven't already completed your health assessment, we encourage you to do so today.",
                isCall: false,
                isSecure: true,
                duration: 5,
                durationType: 'days'
              },
              {
                id: 8,
                memberName: 'Abbott, Robert',
                description: "If you already have an appointment scheduled with your Dedicated Health Coach you are right on track.  If you need to schedule or reschedule an appointment or want to contact your coach, send an email or give us a call.",
                isCall: false,
                isSecure: true,
                duration: 5,
                durationType: 'days'
              },
              {
                id: 9,
                memberName: 'Zyzda, Lisa',
                description: "While you are visiting our site, start getting healthier while having fun by trying one of the trackers or wellness tools.  Go to the Dashboard (the main page) or the Menu to access these wellness activities today!",
                isCall: false,
                isSecure: true,
                duration: 5,
                durationType: 'days'
              },
              {
                id: 10,
                memberName: 'Zurek, Brandon',
                description: "If you have any question about your tracker or need a little motivation, call 877-620-2232 and our team will be happy to help.",
                isCall: false,
                isSecure: true,
                duration: 6,
                durationType: 'days'
              }
            ];
          }
        };
      }
    ]);
})();
