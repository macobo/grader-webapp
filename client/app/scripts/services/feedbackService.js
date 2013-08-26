'use strict';

angular.module('graderApp')
  .factory('feedbackService', function ($http, $q) {
    return {
      askFeedback: function(taskName, code) {
        var deferred = $q.defer();
        $http({
          url: '/api/grade_solution',
          method: 'POST',
          data: {task: taskName, code: code}
        }).success(function (answer) {
          console.log(answer.results);
          deferred.resolve(answer.results);
        }).error(function (data, status, headers, config) {
          console.error('askFeedback', arguments);
          deferred.reject(data);
        });
        return deferred.promise;
      },

      getTasks: function() {
        var deferred = $q.defer();
        $http.get('/api/tasks').then(function(result) {
          deferred.resolve(result.data.tasks);
        }, function(reason) {
          deferred.reject(reason);
        });
        return deferred.promise;
      }
    };
  });
