var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // grunt-contrib-copy
        copy: {
            // copy server side files
            // $ grunt copy:static
            static: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['static/**'],
                        dest: 'dist'
                    }
                ]
            }
        },

        // grunt-contrib-clean
        clean: {
            // clean dist folder
            // $ grunt clean:dist
            dist: {
                src: ['dist/*', 'dist']
            }
        },

        concat: {
            bowerDependencies: {
                src: getBowerDependencies(),
                dest: 'dist/public/js/dependencies.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('serve:dev', [
        'clean:dist',
        'copy:static',
        'concat:bowerDependencies'
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
