const gulp = require('gulp');
const config = require('./gulp_config');
const utilFunctions = require('./lib/gulp_utils');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

function generateScripts(settings) {
  return gulp
    .src(settings.src)
    .pipe(plumber({ errorHandler: utilFunctions.onError }))
    .pipe(concat(settings.outputFile))
    .pipe(gulpIf(config.isNotLocal, uglify()))
    .pipe(gulp.dest(settings.dest));
}

gulp.task('compile:scripts', () => {
  generateScripts({
    src: [
      `${config.paths.scripts.src}/**.js`,
      `!${config.paths.scripts.src}/_*.js`,
    ],
    outputFile: 'scripts.js',
    dest: config.paths.scripts.dest,
  });
});
