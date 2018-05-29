'use strict';

const assert = require('assertthat'),
      shell = require('shelljs');

const expected = {
  exitCode: 0,
  async validate ({ error, dirname }) {
    assert.that(error).is.undefined();

    const configFile = shell.ls('-a', dirname);

    assert.that(configFile).is.containing('.mcfconfig.json');
  }
};

module.exports = expected;
