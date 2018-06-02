'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const runCommand = require('../helpers/runCommand');

const tempDirectory = path.join(__dirname, 'temp');

suite('commands', function () {
  this.timeout(90 * 1000);

  setup(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  teardown(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  suite('create-config', () => {
    const command = 'create-config';

    test('Creates a new config file named .neoconfig.json', async () => {
      const testCase = 'creates-new-config';

      shell.mkdir('-p', tempDirectory);
      shell.cp('-r', path.join(__dirname, command, testCase), tempDirectory);

      const tempTestDirectory = path.join(tempDirectory, testCase);
      const result = await runCommand({ cwd: __dirname, command, directory: tempTestDirectory });

      /* eslint-disable global-require */
      const expected = require(path.join(tempTestDirectory, 'expected.js'));
      /* eslint-enable global-require */

      assert.that(result.exitCode).is.equalTo(expected.exitCode);
      await expected.validate({ result, dirname: tempTestDirectory });
    });
  });
});
