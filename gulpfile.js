'use strict';

var del = require('del');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

var moduleName = 'malarkey';

var paths = {
  coverage: 'coverage/',
  dist: 'dist/',
  karmaConf: __dirname + '/karma.conf.js',
  src: ['index.js'],
  test: ['test/*.spec.js']
};

var defaultTasks = ['lint', 'test'];

gulp.task('lint', function() {
  return gulp.src([].concat(__filename, paths.karmaConf, paths.src, paths.test))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function() { // synchronous
  del([paths.coverage, paths.dist]);
});

gulp.task('dist', ['clean'], function() {
  return gulp.src(paths.src, { read: false })
    .pipe(browserify({
      debug: true, // generate sourcemaps
      insertGlobals: false,
      standalone: moduleName
    }))
    .pipe(rename({ basename: moduleName }))
    .pipe(gulp.dest(paths.dist))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', ['dist'], function(cb) {
  karma.start({
    configFile: paths.karmaConf,
    singleRun: true
  }, cb);
});

gulp.task('watch', defaultTasks, function() {
  gulp.watch([].concat(paths.karmaConf, paths.src, paths.test), defaultTasks);
});

gulp.task('default', defaultTasks);
