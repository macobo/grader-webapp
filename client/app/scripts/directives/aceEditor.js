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
          value: scope.model.trim(),
          lineNumbers: true,
          theme:'default',
          lineWrapping : true,
          mode: 'python'
        };
        var editor = CodeMirror(elem[0], options);
        console.log(scope, scope.model);

        editor.on('change', function (instance) {
          var newValue = instance.getValue();
          scope.model = newValue;
          if (!scope.$$phase) {
            scope.$apply();
          }
        });

        scope.$on('resize', function() {
          $(editor.getWrapperElement()).height(elem.height());
          editor.refresh();
        });
      }
    };
  })
  .directive('asHigh', function() {
    return {
      link: function(scope, elem, attrs) {
        var parent = $(attrs['asHigh']);
        function update() {
          console.log("resizing", elem.height(), parent.height())
          elem.height(parent.height());
          scope.$emit('resize', elem);
        }

        $(window).resize(update);
        update();
      }
    }
  });

