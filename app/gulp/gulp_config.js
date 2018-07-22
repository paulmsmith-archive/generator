const pkg = require('../../package.json');

const config = {
  frontmatterObjectName: false,
  pkg,
  envs: {
    development: {
      name: 'dev',
      assetsURL: '',
    },
    production: {
      name: 'production',
      assetsURL: '',
    },
  },
  paths: {
    src: 'src/',
    dest: 'build/',
    html: {
      src: [
        'src/templates/',
        'src/components/',
      ],
      dest: 'build/',
    },
    stylesheets: {
      src: [
        'src/assets/stylesheets/',
      ],
      dest: 'build/assets/stylesheets/',
    },
    images: {
      src: [
        'src/assets/images/',
      ],
      dest: 'build/assets/images/',
    },
    fonts: {
      src: [
        'src/assets/fonts/',
      ],
      dest: 'build/assets/fonts/',
    },
    scripts: {
      src: [
        'src/assets/scripts/',
      ],
      dest: 'build/assets/scripts/',
    },
  },
};

// establish the environemnt and add hooks
const isProd = (process.env.NODE_ENV === config.envs.production.name);
const isDev = (process.env.NODE_ENV === config.envs.development.name);
const isNotLocal = isDev || isProd;

/**
 * IIFE returns the correct URL for assets dependant on
 * the environment variables declaring what environment
 * this code is running on.
 */
const assetsURL = (function assetsURL() {
  if (isProd) {
    return config.envs.production.assetsURL;
  } else if (isDev) {
    return config.envs.production.assetsURL;
  }
  return '';
}());

const currentEnv = (function currentEnv() {
  if (config.isNotLocal) {
    if (config.isDev) {
      return config.envs.development.name;
    } else if (config.isProd) {
      return config.envs.production.name;
    }
  }
  return 'local';
}());

/**
 * Create a final object with the dynamic properties
 * added in and available to the other gulp files.
 */
module.exports = Object.assign(config, {
  isProd,
  isDev,
  isNotLocal,
  assetsURL,
  currentEnv,
});
