/*jslint node: true */
(function () {
    'use strict';

    var gulp = require('gulp'),
        del = require('del'),
        plugins = require('gulp-load-plugins')();

    gulp.task('clean', function () {
        return del(['dist/']);
    });

    gulp.task('lint', function () {
        return gulp.src('src/**/*.js')
            .pipe(plugins.jslint())
            .pipe(plugins.jslint.reporter('default'));
    });

    gulp.task('watch', function () {
        gulp.watch('src/**/*.js', ['js']);
    });

    gulp.task('build', ['clean', 'lint'], function () {
        return gulp
            .src('src/**/*.html')
            .pipe(plugins.htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(plugins.angularTemplatecache({
                templateHeader: '\n\t',
                templateBody: 'template_manager.cache(\'<%= url %>\',\'<%= contents %>\');',
                templateFooter: '\n',
                moduleSystem: 'iife'
            }))
            .pipe(plugins.addSrc.prepend('src/**/*.js'))
            .pipe(plugins.concat('number-incrementer.bootstrap.js'))
            .pipe(plugins.injectVersion({
                prepend: ''
            }))
            .pipe(gulp.dest('dist/'))
            .pipe(plugins.rename({
                basename: "number-incrementer.bootstrap.min",
                extname: ".js"
            }))
            .pipe(plugins.uglify({
                preserveComments: function (node, comment) {
                    return (/@file/m).test(comment.value);
                }
            }))
            .pipe(gulp.dest('dist/'));
    });

    gulp.task('default', ['build', 'watch']);
}());