module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: {
                files: {
                    src: ["src/*.js", "!src/templates.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask("build", ["jshint"]);
};
