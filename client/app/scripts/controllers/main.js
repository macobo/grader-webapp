'use strict';

angular.module('graderApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.tasks = [
      { name: 'Küpsisetort', unit: 2 },
      { name: 'Nimed', unit: 2 },
      { name: 'Intress', unit: 2},
      { name: 'Täisnurkne kolmnurk', unit: 6 },
      { name: 'Tagurpidi', unit: 12}
    ];

    
  });
