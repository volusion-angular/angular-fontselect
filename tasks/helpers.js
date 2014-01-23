/* global process */
var grunt = require('grunt');
var lf = grunt.util.linefeed;
var fs = require('fs');
var Helpers = {};

Helpers.config = {
  pkg: grunt.file.readJSON('./package.json'),
  env: process.env
};

Helpers.loadConfig = function(path) {
  var glob = require('glob');
  var object = {};
  var key = null;

  glob.sync('*', { cwd: path }).forEach(function(option) {
    key = option.replace(/\.js$/, '');
    object[key] = require('../' + path + option);
  });

  return object;
};

Helpers.cleanupModules = function(src, filepath) {
  /* Normalize line-feeds */
  src = grunt.util.normalizelf(src);

  /* Remove jshint comments */
  src = src.replace(/[\s]*\/\* (jshint|global).*\n/g, '');

  /* Trim */
  src = src.replace(/^\s+|\s+$/g, '');

  /* Indent */
  src = src.split(lf).map(function(line) {
    return '  ' + line;
  }).join(lf);

  return '  // ' + filepath + lf + src;
};

Helpers.getTemplate = function(name) {
  return fs.readFileSync('./tasks/templates/' + name + '.tpl', 'utf8');
};

Helpers.setUpApiKeyFile = function() {
  var keys = {}, hasKeys = false;

  if (process.env.JD_FONTSELECT_GOOGLE_FONTS_API_KEY) {
    keys.googleApiKey = process.env.JD_FONTSELECT_GOOGLE_FONTS_API_KEY;
    hasKeys = true;
  }

  if (hasKeys) {
    fs.writeFileSync(
      'tmp.apikeys.js',
      'angular.module("jdFontselect").constant("jdFontselectConfig", ' + JSON.stringify(keys) + ');'
    );
  }
};

module.exports = Helpers;
