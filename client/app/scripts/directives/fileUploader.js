'use strict';

angular.module('graderApp')
  .directive('fileUploader', function () {
    var linker = function(scope, elem, attr) {
      var dropParagraph = elem.find('p');
      var browseButton = elem.find('a');
      

    };
    return {
      restrict: 'A',
      template: '<form id="file-upload" enctype="multipart/form-data">' +
                  '<div id="drop">' +
                    '<p class="inputtext">DROP FILE HERE</p><a>Browse</a>' +
                    '<input type="file" name="file" />' +
                  '</div>' +
                '</form>',
      replace: true,
      link: linker
    };
  });
