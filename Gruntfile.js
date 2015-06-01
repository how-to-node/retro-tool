var fs = require('fs'),
    path = require('path'),
    mainBowerFiles = require('main-bower-files');;

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // grunt-contrib-copy
        copy: {
            // copy server side files
            static: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/static',
                        src: ['**'],
                        dest: 'dist/static'
                    }
                ]
            },

            // copy client side files
            client: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/public/',
                        src: ['js/**'],
                        dest: 'dist/public'
                    },
                    {
                        expand: true,
                        cwd: 'src/public/',
                        src: ['css/**'],
                        dest: 'dist/public'
                    }
                ]
            },

            bowerDependencies: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: mainBowerFiles('**/*.css'),
                        dest: 'dist/public/css'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: mainBowerFiles('**/fonts/*'),
                        dest: 'dist/public/fonts'
                    }
                ]
            }
        },

        // grunt-contrib-clean
        clean: {
            // clean dist folder
            dist: {
                src: ['dist']
            }
        },

        // grunt-contrib-concat
        concat: {
            // concatenate all bower dependencies
            bowerDependenciesJs: {
                src: mainBowerFiles('**/*.js'),
                dest: 'dist/public/js/dependencies.js'
            }
        },

        // grunt-contrib-less
        less: {
            dev: {
                files: {
                    'dist/public/css/main.css': 'src/public/less/main.less'
                }
            },
        },

        // grunt-express-server
        express: {
            options: {
                background: true
            },
            start: {
                options: {
                    script: 'dist/static/app.js'
                }
            }
        },

        // grunt-contrib-watch
        watch: {
            options: {
                forever: true,
                livereload: true
            },
            public: {
                files: ['src/**/*'],
                tasks: ['copy:static', 'copy:client', 'less:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('serve:dev', [
        'clean:dist',
        'copy:static',
        'copy:client',
        'copy:bowerDependencies',
        'concat:bowerDependenciesJs',
        'less:dev',
        'express:start',
        'watch:public'
    ]);
}
