'use strict';

describe('Directive: fileUploader', function () {
  beforeEach(module('graderApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<file-uploader></file-uploader>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the fileUploader directive');
  }));
});
