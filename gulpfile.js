/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

var gulp = require('gulp');

// https://github.com/adametry/gulp-eslint
var eslint = require('gulp-eslint');

// https://github.com/baer/gulp-nodeunit-runner
var nodeunitRunner = require("gulp-nodeunit-runner");

// https://github.com/jonkemp/gulp-qunit
var qunit = require('gulp-qunit');

// https://github.com/sindresorhus/gulp-mocha
var mocha = require('gulp-mocha');

gulp.task('lint', function () {
  gulp.src(['*.js', 'lib/*.js', 'static/js/bunkai-kumite.js', '!node_modules/**'])
    .pipe(eslint({config: 'eslint.json'}))
    .pipe(eslint.format('stylish'));
});

gulp.task('test', function () {
  gulp.src(['tests/nodeunit/*_spec.js'])
    .pipe(nodeunitRunner({reporter: 'default'}));

  gulp.src('tests/qunit/test-runner.html')
    .pipe(qunit());

  gulp.src(['tests/mocha/*_spec.js'], {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});
