'use strict';

angular.module('graderApp')
  .controller('MainCtrl', function ($scope, feedbackService) {
    // loaded from tasks.json
    feedbackService.getTasks()
      .then(function(tasks) {
        $scope.tasks = tasks;
      });

    $scope.postSolution = function() {
      if ($scope.feedbackAwait) return;

      if ($scope.code && $scope.selectedTask) {
        $scope.feedbackAwait = true;
        $scope.feedback = [];
        feedbackService
          .askFeedback($scope.selectedTask, $scope.code)
          .then(function(feedback) {
            console.log(feedback);
            $scope.feedbackAwait = false;
            $scope.feedback = feedback;
          }, function(reason) {
            console.error(reason);
            $scope.feedbackAwait = false;
          });
      }
    };
  });
