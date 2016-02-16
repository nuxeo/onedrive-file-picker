'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import source from 'vinyl-source-stream';
import eslint from 'gulp-eslint';
import mocha from 'gulp-spawn-mocha';
import babelify from 'babelify';
import { Server } from 'karma';
import gulpSequence from 'gulp-sequence';
import nsp from 'gulp-nsp';

gulp.task('default', ['dist'], () => {
});

gulp.task('lint', () => {
  return gulp.src(['src/**', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', ['lint'], () => {
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
      files: ["demo", "dist"],
      //middleware: [historyApiFallback(), require('proxy-middleware')(proxyOptions)],
      //routes: {
      //  '/bower_components': 'bower_components'
      //}
    }
  });

  gulp.watch(['demo/*'], browserSync.reload);
  gulp.watch(['src/**/*.js'], ['build']);
});
