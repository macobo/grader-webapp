'use strict';

angular.module('graderApp')
  .directive('aceEditor', function () {
    return {
      template: '<pre id="editor" class="ace-editor" ng-transclude></pre>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { model: '=' },

      link: function postLink(scope, element, attrs) {
        element.text(element.text().trim());
        var editor = ace.edit('editor');
        editor.setTheme('ace/theme/xcode');
        editor.getSession().setMode('ace/mode/'+attrs.language);
        editor.getSession().setUseWrapMode(true);
        scope.model = editor.getValue();

        editor.on('change', function() {
          scope.model = editor.getValue();
          scope.$apply();
        });
      }
    };
  });
