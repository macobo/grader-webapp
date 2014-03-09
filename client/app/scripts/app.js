'use strict';

angular.module('graderApp', ['ui.bootstrap', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('editor_blank', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        hasEditor: true,
        resolve: {
          gistInfo: function() { return { post: {} }; }
        }
      })
      .state('gist', {
        url: '/:gistName',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        hasEditor: true,
        resolve: {
          gistInfo: function($stateParams, gist) {
            var name = $stateParams.gistName;
            return gist.load(name);
          }
        }
      })
    $urlRouterProvider.otherwise('/');
  });
