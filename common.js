/* global: module */
var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    templates = require('metalsmith-templates');

var metadata = {
  "title": "DIT4C",
  "description": "Data Intensive Tools for the Cloud"
};

module.exports =
  Metalsmith(__dirname)
    .metadata(metadata)
    .use(markdown())
    .use(permalinks({
      "pattern": ":title"
    }))
    .use(templates({
      "engine": "hogan"
    }));
