'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    root: '..',
    app:  './app',
    dist: '../server/static'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/**/*.html'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: 5000 // flask default
        }
      ],
      e2e: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      options: { force: true },
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      },
      unit_watch: {
        configFile: 'test/karma.conf.js',
        singleRun: false,
        autoWatch: true
      },
      e2e: {
        configFile: 'test/karma-e2e.conf.js'
      },
      e2e_watch: {
        configFile: 'test/karma-e2e.conf.js',
        singleRun: false,
        autoWatch: true
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '<%= yeoman.app %>/styles/compiled_css',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    concat: {
      dist: {
        files: {
          // '<%= yeoman.dist %>/scripts/scripts.js': [
          //   '.tmp/scripts/{,*/}*.js',
          //   '<%= yeoman.app %>/scripts/{,*/}*.js'
          // ]
        }
      }
    },
    // Concat script/css files according to instructions
    // in html files
    useminPrepare: {
      html: ['<%= yeoman.app %>/{,*/}*.html'],
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      options: { mangle: false },
      dist: {
        options: { mangle: false },
        files: {
          /*
          '<%= yeoman.dist %>/scripts/core.js': [
            '<%= yeoman.dist %>/scripts/core.js'
          ],
          '<%= yeoman.dist %>/scripts/guitarteacher.js': [
            '<%= yeoman.dist %>/scripts/guitarteacher.js'
          ],
          '<%= yeoman.dist %>/scripts/tuner.js': [
            '<%= yeoman.dist %>/scripts/tuner.js'
          ]
          */
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
            // Sadly we can't do this since js strings are not updated.
            //'<%= yeoman.dist %>/*.swf'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt,swf,json}',
            '.htaccess',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*',
            'components/ace-builds/src-min-noconflict/**/*.*'
          ]
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  /////////  UNIT and END-TO-END TESTS  ////////

  grunt.registerTask('test', ['unit', 'e2e']);

  grunt.registerTask('unit', ['karma:unit']);

  grunt.registerTask('unit_watch', ['karma:unit_watch']);

  grunt.registerTask('e2e', [
    'clean:server',
    'connect:e2e',
    'karma:e2e'
  ]);

  grunt.registerTask('e2e_watch', [
    'clean:server',
    'connect:e2e',
    'karma:e2e_watch'
  ]);


  // Development server with live reload
  grunt.registerTask('server', [
    'clean:server',
    'compass:server',
    'configureProxies',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);


  // Build production server files
  grunt.registerTask('build', [
    'clean:dist',
//    'jshint',
//    'test',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-ngmin');
};