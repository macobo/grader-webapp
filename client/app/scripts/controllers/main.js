'use strict';

angular.module('graderApp')
  .controller('GlobalCtrl', function($scope, $state) {
    $scope.$state = $state;
    $scope.currentState = $state.current;

    $scope.broadcast = function() {
      console.log('broadcast');
      $scope.$broadcast.apply($scope, arguments);
    };
  })
  .controller('MainCtrl', function ($scope, $state, feedbackService, gist, gistInfo) {
    //console.log(gistInfo)
    $scope.grader_code = gistInfo.post.grader_code || '';
    $scope.solution_code = gistInfo.post.solution_code || '';

    if (gistInfo.name) 
      $scope.gist_name = gistInfo.name;

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

    $scope.save = function(name) {
      gist
        .save($scope.grader_code, $scope.solution_code, name)
        .then(function(result) {
          //console.log("saved as", result);
          $state.go('gist', {gistName: result.name});
        });
    };

    $scope.$on('save', function() {
      $scope.save($scope.gist_name);
    });

    $scope.$on('grade', function() {
      $scope.postSolution();
    });
  })
  .controller('GistListCtrl', function($scope, gists) {
    $scope.gists = gists.results;
  });
