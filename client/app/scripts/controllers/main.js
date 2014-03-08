'use strict';

angular.module('graderApp')
  .controller('MainCtrl', function ($scope, feedbackService) {

    $scope.postSolution = function() {
      if ($scope.solution_code && $scope.grader_code) {
        $scope.feedback = null;

        feedbackService
          .askFeedback($scope.grader_code, $scope.solution_code)
          .then(function(feedback) {
            console.debug('Got feedback', feedback);
            $scope.feedback = feedback;
          }, function(reason) {
            console.error(reason);
          });
      }
    };
  });
