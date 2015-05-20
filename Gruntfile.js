var fs = require('fs'),
    path = require('path');

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
                files: ['src/public/**/*.js', 'src/public/**/*.css'],
                tasks: ['copy:client']
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('serve:dev', [
        'clean:dist',
        'copy:static',
        'copy:client',
        'concat:bowerDependencies',
        'express:start',
        'watch:public'
    ]);
}

// retrieves an array with paths to bower dependencies
function getBowerDependencies() {
    var root = path.join(__dirname, 'bower_components'),
        files = fs.readdirSync(root),
        dependencies = [];

    files.forEach(function(file) {
        var jsDep = path.join(root, file, file + '.js');

        if (fs.existsSync(jsDep)) {
            dependencies.push(jsDep);
        }
    });

    return dependencies;
}
