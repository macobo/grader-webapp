'use strict';

angular.module('graderApp')
  .directive('feedbackItem', function () {
    return {
      template: '' + 
        '<div class="feedback-item">' +
          '<a ng-class="{ success: (result.success), error: (!result.success) }" class="title">' +
            '<i class="fa fa-check" ng-show="result.success"></i> ' +
            '{{ result.description }}' +
            '<span class="pull-right">' +
              '<i class="fa fa-clock-o"></i> {{ result.time }}s' +
            '</span>' + 
          '</a>' +
          '<div ng-hide="result.success" class="reason">' +
            '<div class="error-message">{{ result.error_message }}</div>'+
            '<a href="" ng-click="show_feedback = !show_feedback" class="show-feedback">Näita veateadet</a>' +
            '<editor ng-show="show_feedback" model="result.traceback" read-only></editor>' +
          '</div>' +
        '</div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { result: '=' },

      link: function postLink(scope, elem, attrs) {
      }
    };
  })
  .directive('ngReallyClick', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          var message = attrs.ngReallyMessage;
          if (message && confirm(message)) {
            scope.$apply(attrs.ngReallyClick);
          }
        });
      }
    }
  });
