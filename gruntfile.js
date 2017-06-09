module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        copy: {
            build: {
                files: [
                    {//copy files
                        expand: true,
                        cwd: "./",
                        src: [
                            "./**/*.js",
                            "./**/*.config",
                            "./**/*.json",
                            "!./*gruntfile.js",
                            "!./*start-client.js",
                            "!./client/**",
                            "!./node_modules/**"
                        ],
                        dest: "./build"
                    }
                ]
            }
        },
        ts: {
            app: {
                files: [{
                    src: [
                        "./**/*.ts",
                        "!.baseDir.ts",
                        "!./client/**",
                        "!./node_modules/**"
                    ],
                    dest: "./build"
                }],
                options: {
                    experimentalDecorators: true,
                    module: "commonjs",
                    target: "es5",
                    sourceMap: false
                }
            }
        },
        clean: {
            build: ["./build/**"]
        },
        watch: {
            ts: {
                files: [
                    "./**/*.ts"
                ],
                tasks: ["ts"]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                }
            },
            src: ["./build/test/**/*.js"]
        }
    });

    grunt.loadNpmTasks("grunt-mocha-test")
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", [
        "clean",
        "copy",
        "ts"
    ]);

    grunt.registerTask("test", [
        "default",
        "mochaTest"
    ]);

};