'use strict';

angular.module('graderApp')
  .controller('GlobalCtrl', function($scope, $state, $stateParams, CurrentTester) {
    $scope.$state = $state;
    $scope.currentState = $state.current;
    $scope.$stateParams = $stateParams

    $scope.broadcast = function() {
      $scope.$broadcast.apply($scope, arguments);
    };

    $scope.CurrentTester = CurrentTester;
  })
  .controller('MainCtrl', function ($scope, $state, $stateParams, feedbackService, gist, current) {
    $scope.current = current;
    $scope.anyFeedback = false;
    $scope.gist_name = $stateParams.gistName; //gistInfo.name;

    $scope.postSolution = function() {
      if (current.solution_code && current.tester_code) {
        $scope.feedback = null;
        $scope.error_reason = null;
        $scope.anyFeedback = true;

        feedbackService
          .askFeedback(current)
          .then(function(feedback) {
            console.debug('Got feedback', feedback);
            if (!feedback.success) {
              $scope.error_reason = feedback;
            } else {
              $scope.feedback = feedback;
            }
          }, function(reason) {
            $scope.error_reason = reason;
            console.error(reason);
          });
      }
    };

    function result_redirect(result) {
      $state.go('gist.edit', {gistName: result.name});
      return result;
    };

    $scope.save = function(name) {
      if (!name) {
        name = $scope.gist_name;
      }
      gist
        .save(current, name)
        .then(result_redirect);
    };

    $scope.rename = function() {
      var new_name = window.prompt('Sisesta uus nimi:', $scope.gist_name)
      if (new_name && new_name.length > 6 && $scope.gist_name) {
        gist
          .rename($scope.gist_name, new_name)
          .then(result_redirect);
      } else {
        alert('Antud nimi ei sobi.')
      }
    };

    $scope.$on('save', function() {
      $scope.save($scope.gist_name);
    });

    $scope.$on('grade', function() {
      $scope.save($scope.gist_name);
      $scope.postSolution();
    });
    $scope.$on('rename', $scope.rename );
    $scope.$on('toggle-public', function() {
      current.public = !current.public;
      $scope.save();
    });
  })


  .controller('GistListCtrl', function($scope, gists) {
    $scope.gists = gists.results;
  })


  .controller('AssetsCtrl', function($scope, current){
    $scope.setActive = function(index) {
      console.debug("Setting active file to be", index)
      $scope.active_index = index;
      if (index == -1) {
        $scope.active_file = {
          filename: '',
          contents: current.solution_code
        };
      } else {
        $scope.active_file = current.assets[index];
      }
    };

    $scope.setActive(-1);

    $scope.addAssetFile = function() {
      var filename = window.prompt('Sisesta failinimi:', 'abiline.py');
      var filename_exists = _.chain(current.assets)
                             .pluck('filename')
                             .contains(filename)
                             .value();

      if (filename.length < 5 || filename.length > 20) {
        alert("Failinimi peab olema vahemikus 5 kuni 20 tähemärki");
      } else if (!/^[A-Za-z_0-9]+\.[A-Za-z]{2,4}$/.test(filename)) {
        alert("Failinimi pole valiidne");
      } else if (filename_exists) {
        alert("Sellise nimega fail juba eksisteerib");
      } else {
        current.assets.push({filename: filename, contents: "# "+filename+"\n\n"});
        $scope.setActive(current.assets.length-1);
        $scope.$broadcast('save');
      }
    };

    $scope.removeAssetFile = function(index) {
      current.assets.splice(index, 1);
      console.log("Removing", index, current);
        $scope.$emit('save');
    };

    $scope.$watch('active_file', function(new_value) {
      var contents = new_value.contents;
      console.debug("Contents changed", [$scope.active_index, contents]);
      if ($scope.active_index == -1)
        current.solution_code = contents;
      else
        current.assets[$scope.active_index].contents = contents;
    }, true);
  });
