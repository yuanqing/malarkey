'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

var paths = {
  src: ['src/*.js'],
  coverage: 'coverage/',
  dist: 'dist/',
  karma: __dirname + '/test/karma.conf.js',
  test: ['test/spec/**/*.spec.js'],
};

gulp.task('lint', function() {
  return gulp.src(paths.src.concat(paths.test, __filename))
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function() {
  return gulp.src([paths.coverage, paths.dist], { read: false })
    .pipe(plumber())
    .pipe(rimraf());
});

gulp.task('dist', ['clean'], function() {
  return gulp.src(paths.src, { read: false })
    .pipe(plumber())
    .pipe(browserify({
      insertGlobals: false,
      debug: true,
      standalone: 'malarkey'
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', ['dist'], function(done) {
  karma.start({
    configFile: paths.karma,
    singleRun: true
  }, done);
});

gulp.task('tdd', ['dist'], function() {
  gulp.watch(paths.src, ['dist']);
});

gulp.task('default', [
  'lint',
  'dist',
  'test'
]);
