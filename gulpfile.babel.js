const requireDir = require('require-dir');
// Require all tasks in lib/gulp, including subfolders
requireDir('./app/gulp', { recurse: true });
