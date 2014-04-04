'use strict';

angular.module('graderApp')
  .factory('feedbackService', function ($http, $q) {
    return {
      askFeedback: function(data) {
        console.log('Asking feedback', arguments);
        var deferred = $q.defer();
        $http({
          url: '/api/grade',
          method: 'POST',
          data: data
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
        if (name) name = '/' + encodeURIComponent(name);
        else name = '';
        var deferred = $q.defer();
        $http.get('/api/gists'+name)
          .success(function (answer) {
            console.log(answer)
            deferred.resolve(answer);
          }).error(function (data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      save: function(data, name) {
        var data = { 
          'post': data
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
      },
      rename: function(old_name, new_name) {
        var deferred = $q.defer();
        $http({
          url: '/api/gists/'+encodeURIComponent(old_name)+'/update_name',
          method: 'POST',
          data: {'new_name': new_name}
        }).success(function (answer) {
          deferred.resolve(answer);
        }).error(function (data, status, headers, config) {
          deferred.reject(data);
        });
        return deferred.promise;
      }
    };
  })
  .factory('CurrentTester', function() {
    // api:
    // .solution_code, .tester_code
    // .assets = [{filename: "", contents: ""}]
    // setCurrent(gist)

    var current = {
      tester_code: '',
      solution_code: '',
      assets: []
    };
    current.setCurrent = function(gistInfo) {
      var post = {};
      if (gistInfo && gistInfo.post) 
        post = gistInfo.post;
      current.tester_code = post.tester_code || '';
      current.solution_code = post.solution_code || '';
      current.assets = post.assets || [];
      return current;
    };

    return current;
  })