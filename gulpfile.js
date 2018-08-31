/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

const gulp = require('gulp');

// https://github.com/adametry/gulp-eslint
const eslint = require('gulp-eslint');

// https://github.com/baer/gulp-nodeunit-runner
const nodeunitRunner = require('gulp-nodeunit-runner');

// https://github.com/sindresorhus/gulp-mocha
const mocha = require('gulp-mocha');

gulp.task('lint', () => {
  return gulp.src(['*.js', 'lib/*.js', 'static/js/bunkai-kumite.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'));
});

gulp.task('test', () => {
  gulp.src(['tests/nodeunit/*_spec.js'])
    .pipe(nodeunitRunner({
      reporter: 'default'
    }));

  return gulp.src(['tests/mocha/*_spec.js'], {
    read: false
  }).pipe(mocha({
    reporter: 'nyan'
  }));
});
