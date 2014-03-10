'use strict';

angular.module('graderApp')
  .controller('GlobalCtrl', function($scope, $state, $stateParams) {
    $scope.$state = $state;
    $scope.currentState = $state.current;
    $scope.$stateParams = $stateParams

    $scope.broadcast = function() {
      $scope.$broadcast.apply($scope, arguments);
    };
  })
  .controller('MainCtrl', function ($scope, $state, feedbackService, gist, gistInfo) {
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

    function result_redirect(result) {
      $state.go('gist', {gistName: result.name});
      return result;
    };

    $scope.save = function(name) {
      gist
        .save($scope.grader_code, $scope.solution_code, name)
        .then(result_redirect);
    };

    $scope.rename = function() {
      var new_name = window.prompt('Sisesta uus nimi:', $scope.gist_name)

      if (new_name && new_name.length > 6 && $scope.gist_name) {
        gist
          .rename($scope.gist_name, new_name)
          .then(result_redirect);
      }
    };

    $scope.$on('save', function() {
      $scope.save($scope.gist_name);
    });

    $scope.$on('grade', $scope.postSolution );
    $scope.$on('rename', $scope.rename );
  })
  .controller('GistListCtrl', function($scope, gists) {
    $scope.gists = gists.results;
  });
