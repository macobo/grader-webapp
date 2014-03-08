'use strict';

angular.module('graderApp')
  .factory('feedbackService', function ($http, $q) {
    return {
      askFeedback: function(grader_code, solution_code) {
        console.log('Asking feedback', arguments);
        var deferred = $q.defer();
        $http({
          url: '/api/grade',
          method: 'POST',
          data: {solution_code: solution_code, grader_code: grader_code}
        }).success(function (answer) {
          deferred.resolve(answer);
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
