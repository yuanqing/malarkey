'use strict';

var del = require('del');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

var paths = {
  coverage: 'coverage/',
  dist: 'dist/',
  karmaConf: __dirname + '/test/karma.conf.js',
  src: ['src/*.js'],
  test: ['test/spec/**/*.spec.js']
};

var defaultTasks = ['lint', 'test'];

gulp.task('lint', function() {
  return gulp.src(paths.src.concat(paths.test, paths.karmaConf, __filename))
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function (cb) {
  del([paths.coverage, paths.dist], cb);
});

gulp.task('dist', ['clean'], function() {
  return gulp.src(paths.src, { read: false })
    .pipe(plumber())
    .pipe(browserify({
      debug: true, // generate sourcemap
      insertGlobals: false,
      standalone: 'malarkey'
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', ['dist'], function(done) {
  karma.start({
    configFile: paths.karmaConf,
    singleRun: true
  }, done);
});

gulp.task('watch', defaultTasks, function() {
  gulp.watch(paths.src.concat(paths.test, paths.karmaConf), defaultTasks);
});

gulp.task('default', defaultTasks);
