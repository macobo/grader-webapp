'use strict';

angular.module('graderApp')
  .directive('editor', function () {
    return {
      template: '<div class="editor">' +
                '</div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { model: '=', initCode: '@' },

      link: function postLink(scope, elem, attrs) {
        var options = { 
          value: scope.initCode.trim(),
          lineNumbers: true,
          theme:'default',
          lineWrapping : true,
          mode: 'python'
        };
        var editor = CodeMirror(elem[0], options);

        scope.$on('resize', function() {
          $(editor.getWrapperElement()).height(elem.height());
          editor.refresh();
        })
      }
    };
  })
  .directive('asHigh', function() {
    return {
      link: function(scope, elem, attrs) {
        var parent = $(attrs['asHigh']);
        function update() {
          elem.height(parent.height());
          scope.$emit('resize', elem);
        }

        $(window).resize(update);
        update();
      }
    }
  });

