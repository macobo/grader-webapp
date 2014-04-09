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

      })
      .state('gist', {
        url: '/g',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('gist.new', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        hasEditor: true,
        resolve: {
          current: function(CurrentTester) { return CurrentTester.setCurrent(); }
        }
      })
      .state('gist.edit', {
        url: '/:gistName',
        hasEditor: true,
        resolve: {
          current: function($stateParams, gist, CurrentTester) {
            var name = $stateParams.gistName;
            return gist.load(name).then(function(gistInfo) {
              return CurrentTester.setCurrent(gistInfo);
            });
          }
        },
        views: {
          "": {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
          },
          "solution_files@gist.edit": {
            templateUrl: 'views/solution_files.html',
            controller: 'AssetsCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/');
  })
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  });