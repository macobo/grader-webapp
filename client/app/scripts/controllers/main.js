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

    $scope.postSolution = function() {
      if ($scope.code && $scope.selectedTask) {
        var data = {
          code: $scope.code,
          task: $scope.selectedTask
        };
        $http({
          url: '/api/grade_solution',
          method: 'POST',
          data: data,
        }).success(function () {
          console.debug('success, ', arguments);
        }).error(function (data, status, headers, config) {
          console.debug('failure, ', arguments);
        });
      }
    };
  });
