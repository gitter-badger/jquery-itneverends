'use strict';

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <osahner@gmail.com>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    less: {
      options: {
        //sourceMap: true,
        outputSourceFiles: true,
        //sourceMapURL: '/fileadmin/css/theme.map'
      },
      dist: {
        src: ['less/<%= pkg.name %>.less'],
        dest: 'dist/jquery.<%= pkg.name %>.css'
      },
      site: {
        src: ['less/site.less'],
        dest: 'public/css/site.css'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:9000/test/<%= pkg.name %>.html']
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      express: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'index.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit'],
        options: {
          livereload: true,
        }
      },
      demo: {
        files: [
          'src/*.js',
          'dist/*.css',
          'index.html'
        ],
        options: {
          livereload: true,
        }
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'connect', 'qunit', 'clean', 'less', 'concat', 'uglify']);
  grunt.registerTask('dist', ['clean', 'less', 'concat', 'uglify']);
  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
