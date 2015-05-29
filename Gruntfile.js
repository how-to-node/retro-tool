var fs = require('fs'),
    path = require('path'),
    glob = require('glob');

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
            bowerDependencies: {
                src: getBowerDependencies(),
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

            // TODO: verify cleancss is still in there
            // TODO: csso, minifiycss
            prod: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    'dist/public/css/main.css': 'src/public/less/main.less'
                }
            }
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
                files: ['src/public/**/*'],
                tasks: ['copy:client']
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
        'concat:bowerDependencies',
        'less:dev',
        'express:start',
        'watch:public'
    ]);
}

// retrieves an array with paths to bower dependencies
function getBowerDependencies() {
    var root = path.join(__dirname, 'bower_components'),
        bowerComponents = fs.readdirSync(root),
        dependencies = [];

    bowerComponents.forEach(function(bowerComponent) {
        var files = glob.sync(path.join(root, bowerComponent, '**', bowerComponent + '.js'));
        dependencies.cocat(files);
    });

    console.log('dependencies: ', dependencies);
    return dependencies;
}
