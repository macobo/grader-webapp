'use strict';

angular.module('graderApp', ['ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          tasks: function(feedbackService) {
            return feedbackService.getTasks().promise;
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
