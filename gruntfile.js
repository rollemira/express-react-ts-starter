module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        copy: {
            build: {
                files: [
                    {//copy files
                        expand: true,
                        cwd: './',
                        src: [
                            './config/**',
                            './package.json',
                            './web.config',
                            './www.js'
                        ],
                        dest: './build'
                    }
                ]
            }
        },
        ts: {
            app: {
                files: [{
                    src: [
                        './models/**/*.ts',
                        './routes/**/*.ts',
                        './test/**/*.ts',
                        './utils/**/*.ts',
                        './app.ts'
                    ],
                    dest: './build'
                }],
                options: {
                    rootDir: './',
                    experimentalDecorators: true,
                    module: 'commonjs',
                    target: 'es5',
                    sourceMap: false
                }
            }
        },
        clean: {
            build: ['./build/**']
        },
        watch: {
            ts: {
                files: [
                    './models/**/*.ts',
                    './routes/**/*.ts',
                    './test/**/*.ts',
                    './utils/**/*.ts',
                    './app.ts'
                ],
                tasks: ['test']
            }
        },
        env: {
            test: {
                NODE_ENV: 'testing'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                }
            },
            src: ['./build/test/**/*.js']
        }
    });

    grunt.registerTask('default', [
        'clean',
        'copy',
        'ts'
    ]);

    grunt.registerTask('test', [
        'env:test',
        'default',
        'mochaTest'
    ]);

};