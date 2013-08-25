'use strict';

angular.module('graderApp', ['ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          "tasks": function($http) {
            return $http.get('/api/tasks');
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
