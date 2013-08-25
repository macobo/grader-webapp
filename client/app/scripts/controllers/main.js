'use strict';

angular.module('graderApp')
  .controller('MainCtrl', function ($scope, $http, tasks) {
    // loaded from tasks.json
    $scope.tasks = tasks.data.tasks;

    $scope.postSolution = function() {
      if ($scope.feedbackAwait) return;

      if ($scope.code && $scope.selectedTask) {
        $scope.feedbackAwait = true;
        var data = {
          code: $scope.code,
          task: $scope.selectedTask
        };
        $scope.feedback = [];
        $http({
          url: '/api/grade_solution',
          method: 'POST',
          data: data,
        }).success(function (answer) {
          console.log(answer, arguments);
          $scope.feedback = answer.results;
          $scope.feedbackAwait = false;
        }).error(function (data, status, headers, config) {
          console.debug('failure, ', arguments);
          $scope.feedbackAwait = false;
          if (!$scope.$$phase) $scope.$apply();
        });
      }
    };
  });
