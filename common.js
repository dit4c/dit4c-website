/* global: module */
var Metalsmith = require('metalsmith'),
    _ = require('lodash'),
    Q = require('q'),
    assets = require('metalsmith-assets'),
    bower = require('bower'),
    include = require('metalsmith-include-content'),
    layouts = require('metalsmith-layouts'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    wordcount = require('metalsmith-word-count');

var metadata = {
  "title": "DIT4C",
  "description": "Data Intensive Tools for the Cloud"
};

var bowerPlugin = function (files, metalsmith, done) {
  bower.commands
    .install()
    .on('end', function () {
      bower.commands
        .list()
        .on('end', function (output) {
          var libs = (function(data) {
            var deps = function(m, data) {
              return _.reduce(data.dependencies, function(m, v, k) {
                return deps(_.set(m, k, v.canonicalDir), v);
              }, m);
            };
            return deps({}, data);
          })(output);
          _.reduce(libs, function(m, v, k) {
            return m.then(function() {
              var d = Q.defer();
              (assets({
                source: v,
                destination: './libs/'+k
              }))(files, metalsmith, function() { d.resolve(); });
              return d.promise;
            });
          }, Q('')).done(function() { done(); });
        });
    });
}

module.exports =
  Metalsmith(__dirname)
    .frontmatter(true)
    .metadata(metadata)
    .clean(true)
    .use(include())
    .use(markdown())
    .use(layouts({
      "engine": "hogan",
      "rename": true
    }))
    .use(permalinks({
      "pattern": ":title"
    }))
    .use(assets({
      source: './assets',
      destination: '.'
    }))
    .use(bowerPlugin)
    .use(wordcount());
