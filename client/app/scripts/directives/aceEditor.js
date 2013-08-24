'use strict';

angular.module('graderApp')
  .directive('aceEditor', function () {
    return {
      template: '<div class="ace-container"><pre id="editor" class="ace-editor" ng-transclude></pre></div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { model: '=', initCode: '@' },

      link: function postLink(scope, elem, attrs) {
        var editor = ace.edit(elem[0]);
        editor.setTheme('ace/theme/xcode');
        editor.getSession().setMode('ace/mode/'+attrs.language);
        editor.getSession().setUseWrapMode(true);
        editor.setShowPrintMargin(false);
        editor.setShowInvisibles(true);

        if (attrs.hasOwnProperty('static')) {
          editor.setReadOnly(true);
          editor.renderer.setShowGutter(false);
        }

        scope.model = editor.getValue();

        editor.on('change', function() {
          scope.model = editor.getValue();
          //if (!scope.$$phase) scope.$apply();
        });

        scope.$watch('initCode', function() {
          editor.setValue(scope.initCode.trim(), 0);
          editor.clearSelection();
          if (attrs.hasOwnProperty('static')) {
            var lines = scope.initCode.trim().split('\n').length;
            elem.css('height', 2*lines+'em');
            editor.resize();
          }
        });
      }
    };
  });
