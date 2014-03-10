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
        var emit = function(evnt) {
          return function() {
            scope.$emit(evnt);
          };
        };

        var options = { 
          value: scope.model.trim(),
          lineNumbers: true,
          theme:'default',
          nocursor: attrs.hasOwnProperty('readOnly') ? 'nocursor' : false,
          lineWrapping : true,
          mode: 'python',
          extraKeys: {
            'Ctrl-Enter': emit('grade'),
            'Ctrl-S': emit('save')
          }
        };
        var editor = CodeMirror(elem[0], options);

        editor.on('change', function (instance) {
          var newValue = instance.getValue();
          scope.model = newValue;
          if (!scope.$$phase) {
            scope.$apply();
          }
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
        }

        $(window).resize(update);
        setTimeout(update, 100);
      }
    }
  });

