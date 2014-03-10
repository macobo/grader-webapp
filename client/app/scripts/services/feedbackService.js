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
  })
  .factory('gist', function ($http, $q) {
    return {
      load: function(name) {
        if (name) name = '/' + name;
        else name = '';
        var deferred = $q.defer();
        $http.get('/api/gists'+name)
          .success(function (answer) {
            deferred.resolve(answer);
          }).error(function (data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      save: function(grader_code, solution_code, name) {
        var data = { 
          'post': {
            'solution_code': solution_code,
            'grader_code': grader_code
          }
        };
        if (name) 
          data['name'] = name;

        console.log("Saving", data);

        var deferred = $q.defer();
        $http({
          url: '/api/gists',
          method: 'POST',
          data: data
        }).success(function (answer) {
          deferred.resolve(answer);
        }).error(function (data, status, headers, config) {
          console.error('saveGist', arguments);
          deferred.reject(data);
        });
        return deferred.promise;
      }
    };
  })