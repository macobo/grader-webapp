'use strict';

angular.module('graderApp')
  .directive('aceEditor', function () {
    return {
      template: '<div class="ace-container">' +
                  '<div class="editor"></div>'+
                '</div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { model: '=', initCode: '@' },

      link: function postLink(scope, elem, attrs) {
        var e = elem.find("div");
        var editor = ace.edit(e[0]);

        editor.setTheme("ace/theme/chrome");
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
          _.defer(function(){scope.$apply();});
        });

        scope.$watch('initCode', function() {
          editor.setValue(scope.initCode.trim(), 0);
          editor.clearSelection();
          if (attrs.hasOwnProperty('static')) {
            //var lines = scope.initCode.trim().split('\n').length;
            //elem.css('height', 2*lines+'em');
            editor.resize();
          }
        });

        function resizeAce() {
          console.log("RESIZE", e, elem.height());
          editor.resize();
        };
        //listen for changes
        $(window).resize(resizeAce);
        //set initially
        resizeAce();
        console.log(attrs)
        if (attrs["asHighAs"]) {
          elem.height($(attrs["asHighAs"]).height())
        }

      }
    };
  });
