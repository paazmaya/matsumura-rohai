/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */

const gulp = require('gulp');

// https://github.com/baer/gulp-nodeunit-runner
const nodeunitRunner = require('gulp-nodeunit-runner');

// https://github.com/sindresorhus/gulp-mocha
const mocha = require('gulp-mocha');

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
