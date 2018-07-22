const gulp = require('gulp');
const config = require('./gulp_config');
const utilFunctions = require('./lib/gulp_utils');
const plumber = require('gulp-plumber');
const globImporter = require('node-sass-glob-importer');
const sassVariables = require('gulp-sass-variables');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const header = require('gulp-header');
const pixrem = require('gulp-pixrem');
const cleanCSS = require('gulp-clean-css');

const banner = [
  '/**',
  ' * @name <%= pkg.name %>: <%= pkg.description %>',
  ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
].join('\n');

const AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 4',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
];

function generateStylesheets() {
  return gulp
    .src([
      `${config.paths.stylesheets.src}**/*.scss`,
      `!${config.paths.stylesheets.src}{fonts,kss}/*.*`])
    .pipe(plumber({ errorHandler: utilFunctions.onError }))
    .pipe(sassVariables({
      $env: config.currentEnv,
      $assetsURLDev: config.envs.development.assetsURL,
      $assetsURLProd: config.envs.production.assetsURL,
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: globImporter(),
      outputStyle: 'expanded',
      includePaths: [
        config.paths.src,
      ],
    }))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(pixrem())
    .pipe(header(banner, { pkg: config.pkg }))
    .pipe(gulpIf(!config.isNotLocal, sourcemaps.write()))
    .pipe(gulpIf(config.isNotLocal, cleanCSS({ debug: true, compatibility: 'ie8' }, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    })))
    .pipe(gulp.dest(config.paths.stylesheets.dest));
}

gulp.task('compile:stylesheets', () => {
  generateStylesheets();
});
