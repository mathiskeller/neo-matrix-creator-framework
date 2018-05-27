'use strict';

const fs = require('fs');

const promisify = require('util.promisify');

const readFile = promisify(fs.readFile);

const read = async function ({ path, encoding } = {}) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  return await readFile(path, { encoding: encoding || 'utf8' });
};

module.exports = read;
