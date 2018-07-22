const gulp = require('gulp');
const config = require('./gulp_config');
const utilFunctions = require('./lib/gulp_utils');
const plumber = require('gulp-plumber');
const nunjucksRender = require('gulp-nunjucks-render');
const nunjucksFilters = require('./lib/nunjucks_filters');
const WithExtension = require('@allmarkedup/nunjucks-with');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const templateData = require('gulp-data');
const frontMatter = require('gulp-gray-matter');
const tap = require('gulp-tap');
const path = require('path');
const prettify = require('gulp-jsbeautifier');

/**
 * function used to instantiate nunjucks with bespoke settings
 * @param {Object} nunj the default nunjucks environment object
 */
const nunjucksEnvironment = function nunjucksEnvironment(nunj) {
  const nunjFilters = nunjucksFilters(
    nunj,
    {
      isDev: config.isDev,
      isNotLocal: config.isNotLocal,
      isProd: config.isProd,
      assetsURL: config.assetsURL,
    },
  );

  // loop over the filters and add them to the nunjucks env
  Object.keys(nunjFilters).forEach((filterName) => {
    nunj.addFilter(filterName, nunjFilters[filterName]);
  });

  // ability to check if it's dev or  production within the templates
  nunj.addGlobal('isNotLocal', config.isNotLocal);

  // a url for assets if dev or production
  nunj.addGlobal('assetsURL', config.assetsURL);

  nunj.addExtension('WithExtension', new WithExtension());

  // marked config
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pendantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  });

  // adds markdown extension
  markdown.register(nunj, marked);
};

/**
 * Templates generation task uses this function so it can be configured
 * differently to build dev, production, etc.
 * @param {Object} templatesConfig a set of paths and configuration options
 */
function generateTemplates(templatesConfig) {
  let fileDetails;
  return gulp
    .src([
      `${config.paths.html.src[0]}**/{*.html,*.njk}`,
    ])
    .pipe(tap((file) => {
      fileDetails = path.parse(file.path);
      fileDetails.sysPath = (file.path);
    }))
    .pipe(plumber({ errorHandler: utilFunctions.onError }))
    .pipe(frontMatter({
      property: `data.${config.frontmatterObjectName || 'page'}`,
    }))
    .pipe(templateData(() => ({
      thisTemplateFile: fileDetails,
    })))
    .pipe(nunjucksRender({
      path: config.paths.html.src,
      manageEnv: nunjucksEnvironment,
    }))
    .pipe(prettify(Object.assign({
      indent_size: 2,
      html: {
        indent_inner_html: true,
        end_with_newline: true,
        max_preserve_newlines: 0,
        wrap_line_length: 500,
      },
    }, templatesConfig.prettify)))
    .pipe(gulp.dest(config.paths.html.dest));
}

gulp.task('build:templates', () => {
  generateTemplates({
    prettify: {
      indent_size: 2,
    },
  });
});
