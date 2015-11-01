'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const spawn = require('child_process').spawn;


gulp.task('test', (cb) => {
  const child = spawn('npm', ['--silent', 'run', 'test'], {stdio: 'inherit'});
  child.on('close', () => cb());
});

gulp.task('watch', () => {
  watch('**/*.js', () => gulp.start('test'));
});


gulp.task('default', []);
