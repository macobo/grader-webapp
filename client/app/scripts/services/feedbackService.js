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
          deferred.resolve(answer.result);
        }).error(function (data, status, headers, config) {
          deferred.reject(data);
        });
        return deferred;
      },

      getTasks: function() {
        var deferred = $q.defer();
        $http.get('/api/tasks').then(function(result) {
          deferred.resolve(result.data.tasks);
        }, function(reason) {
          deferred.reject(reason);
        });
        return deferred;
      }
    };
  });