'use strict';

const path = require('path');

const requireDir = require('require-dir');

module.exports = requireDir(path.join(__dirname, 'matrix'));
