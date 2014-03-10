'use strict';

angular.module('graderApp')
  .directive('feedbackItem', function () {
    return {
      template: '' + 
        '<div class="feedback-item">' +
          '<a ng-class="{ success: (result.success), error: (!result.success) }">' +
            '<i class="icon-ok check-mark" ng-show="result.success"></i>' +
            '{{ result.description }}' +
            '<span class="pull-right">' +
              '<i class="icon-time"></i> {{ result.time }}s' +
            '</span>' + 
          '</a>' +
          '<editor ng-hide="result.success" model="result.traceback" read-only></editor>' +
        '</div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { result: '=' },

      link: function postLink(scope, elem, attrs) {

      }
    };
  });

