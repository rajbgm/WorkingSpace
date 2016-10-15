(function ($) {
  'use strict';

  angular.module('olh-lps-member')
    .controller('ClinicalNotesController', [
      '$scope',
      function ($scope) {
        $scope.slideClinicalNotes = function () {
          var effect = 'slide',
            options = {direction: 'left'},
            duration = 500;

          $('#clinicalNotesDiv').toggle(effect, options, duration);
        };
      }
    ]);
})(window.jQuery);
