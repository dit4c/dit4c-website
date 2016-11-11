/* global: module */
var Metalsmith = require('metalsmith'),
    include = require('metalsmith-include-content'),
    layouts = require('metalsmith-layouts'),
    less = require('metalsmith-less'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    wordcount = require('metalsmith-word-count');

var metadata = {
  "title": "DIT4C",
  "description": "Data Intensive Tools for the Cloud"
};

module.exports =
  Metalsmith(__dirname)
    .frontmatter(true)
    .metadata(metadata)
    .clean(true)
    .use(include())
    .use(less())
    .use(markdown())
    .use(layouts({
      "engine": "hogan",
      "rename": true
    }))
    .use(permalinks({
      "pattern": ":title"
    }))
    .use(wordcount());
