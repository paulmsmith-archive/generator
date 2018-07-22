const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', () => {
  runSequence(
    'clean',
    [
      'compile:scripts',
      'compile:stylesheets',
      'optimise:images',
      'build:templates',
      'handle:fonts',
    ],
  );
});

gulp.task('default', () => {
  runSequence(
    'build',
    'run:localserver',
  );
});
