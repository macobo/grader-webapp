'use strict';

describe('Directive: aceEditor', function () {
  beforeEach(module('graderApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<ace-editor></ace-editor>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the aceEditor directive');
  }));
});
