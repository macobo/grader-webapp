'use strict';

angular.module('graderApp')
  .controller('MainCtrl', function ($scope, feedbackService, tasks) {
    // loaded from tasks.json
    $scope.tasks = tasks;

    $scope.postSolution = function() {
      if ($scope.feedbackAwait) return;

      if ($scope.code && $scope.selectedTask) {
        $scope.feedbackAwait = true;
        $scope.feedback = [];
        feedbackService
          .askFeedback($scope.selectedTask, $scope.code)
          .then(function(feedback) {
            $scope.feedbackAwait = false;
            $scope.feedback = feedback;
          }, function(reason) {
            $scope.feedbackAwait = false;
          });
      }
    };
  });
