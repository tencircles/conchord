module.exports = GruntFile;
function GruntFile (grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        browserify: {
            dev: {
                options: {
                    watch: true,
                    verbose: true,
                    open: true,
                    debug: true,
                    browserifyOptions: {
                        debug: true
                    },
                    transform: [["babelify", {"stage": 0, "sourceMap": true}]]
                },
                files: {
                    ".tmp/bundle.js": "src/index.js"
                }
            },
            dist: {
                options: {
                    transform: [["babelify", {"stage": 0}]]
                },
                files: {
                    "dist/conchord.js": "src/index.js"
                }
            }
        },
        connect: {
            dev: {
                options: {
                    base: [".tmp/", "app/", "*"],
                    keepalive: false,
                    hostname: "localhost"
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js:  {
                files: ["src/**.js"],
                tasks: ["browserify:dev"]
            }
        }
    });
    grunt.registerTask("default", [
        "browserify:dev",
        "connect",
        "watch"
    ]);
    grunt.registerTask("build", [
        "browserify:dist"
    ]);
}
