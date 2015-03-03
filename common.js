/* global: module */
var Metalsmith = require('metalsmith'),
    less = require('metalsmith-less'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    templates = require('metalsmith-templates'),
    wordcount = require('metalsmith-word-count');

var metadata = {
  "title": "DIT4C",
  "description": "Data Intensive Tools for the Cloud"
};

module.exports =
  Metalsmith(__dirname)
    .clean(true)
    .metadata(metadata)
    .use(less())
    .use(markdown())
    .use(permalinks({
      "pattern": ":title"
    }))
    .use(templates({
      "engine": "hogan"
    }))
    .use(wordcount());
