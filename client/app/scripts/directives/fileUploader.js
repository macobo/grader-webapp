'use strict';

angular.module('graderApp')
  .directive('fileUploader', function () {

    var linker = function(scope, elem, attrs) {
      var dropParagraph = elem.find('p');
      var browseButton = elem.find('a');
      var fileInput = elem.find('input');


      var processDragOverOrEnter = function(event) {
        console.log(event);
        event.preventDefault();
        event.originalEvent.dataTransfer.effectAllowed = 'copy';
        return false;
      };
      elem.bind('dragover', processDragOverOrEnter);
      elem.bind('dragenter', processDragOverOrEnter);

      var setFile = function(file) {
        scope.file = file;
        dropParagraph.text(file.name);
      };

      scope.file = null;

      browseButton.click(function() {
        fileInput.click();
      });

      fileInput.bind('change', function(event) {
        setFile(this.files[0]);
        scope.$apply();
      })

      elem.bind('drop', function(event) {
        event.preventDefault();
        setFile(event.originalEvent.dataTransfer.files[0]);
      });
    };

    return {
      restrict: 'A',
      template: '<form id="file-upload" enctype="multipart/form-data">' +
                  '<div class="drop">' +
                    '<p class="inputtext">DROP FILE HERE</p>' +
                    '<a class="uploadbutton">Browse</a>' +
                    '<input type="file" name="file" />' +
                  '</div>' +
                  '<div ng-transclude></div>' +
                '</form>',
      replace: true,
      transclude: true,
      link: linker
    };
  });
