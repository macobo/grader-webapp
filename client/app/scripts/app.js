'use strict';

angular.module('graderApp', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'chieffancypants.loadingBar'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('list', {
        url: '',
        templateUrl: 'views/list.html',
        controller: 'GistListCtrl',
        resolve: {
          gists: function(gist) { return gist.load(); }
        }
      })
      .state('editor_blank', {
        url: '/g',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        hasEditor: true,
        resolve: {
          gistInfo: function() { return { post: {} }; }
        }
      })
      .state('gist', {
        url: '/g/:gistName',
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
  })
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  });