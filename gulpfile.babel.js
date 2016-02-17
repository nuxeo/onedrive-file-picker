'use strict';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import cssnano from 'gulp-cssnano';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import eslint from 'gulp-eslint';
import mocha from 'gulp-spawn-mocha';
import babelify from 'babelify';
import { Server } from 'karma';
import gulpSequence from 'gulp-sequence';
import nsp from 'gulp-nsp';

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('default', ['dist'], () => {
});

gulp.task('lint', () => {
  return gulp.src(['src/**', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('styles', () => {
  return gulp.src(['src/styles/**'])
      .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(concat('onedrive-file-picker.min.css'))
      .pipe(cssnano())
      .pipe(gulp.dest('dist'));
});

gulp.task('build', ['lint', 'styles'], () => {
  return browserify({
    entries: ['src/index.js'],
    standalone: 'OneDriveFilePicker',
  })
  .transform(babelify)
  .bundle()
  .pipe(source('onedrive-file-picker.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('test:node', ['build:node'], () => {
  return gulp.src('test/**/*.spec.js')
    .pipe(mocha({
      require: ['./test/helpers/setup.js', './test/helpers/setup-node.js'],
      compilers: 'js:babel-core/register',
    }));
});

gulp.task('test:browser', ['build:node', 'build:browser'], (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, (exitStatus) => done(exitStatus ? 'Browser tests failed' : undefined)).start();
});

gulp.task('test', gulpSequence('test:node', 'test:browser'));

gulp.task('prepublish', ['nsp', 'test']);

gulp.task('nsp', (done) => {
  nsp({ package: __dirname + '/package.json' }, done);
});

gulp.task('demo', ['build'], function() {
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    https: true,
    server: {
      baseDir: ["demo", "dist"],
      files: ["demo", "dist"]
    }
  });

  gulp.watch(['demo/*'], browserSync.reload);
  gulp.watch(['src/**/*.js'], ['build']);
});
