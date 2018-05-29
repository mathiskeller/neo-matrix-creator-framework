'use strict';

const path = require('path');

const assert = require('assertthat'),
      buntstift = require('buntstift'),
      shell = require('shelljs');

const runCommand = require('./runCommand');

const createTestForCommand = function ({ cwd, command, testCase, tempDirectory }) {
  if (!cwd) {
    throw new Error('Cwd is missing.');
  }
  if (!command) {
    throw new Error('Command is missing.');
  }
  if (!testCase) {
    throw new Error('Test cases are missing.');
  }
  if (!tempDirectory) {
    throw new Error('Temp directory is missing.');
  }

  test(`${testCase.replace(/-/g, ' ')}.`, async () => {
    shell.mkdir('-p', tempDirectory);
    shell.cp('-r', path.join(cwd, command, testCase), tempDirectory);

    const tempTestDirectory = path.join(tempDirectory, testCase);

    let pre;

    try {
      /* eslint-disable global-require */
      pre = require(path.join(cwd, command, testCase, 'pre.js'));
      /* eslint-enable global-require */
    } catch (ex) {
      pre = async function () {
        // Dummy method as fallback
      };
    }

    buntstift.line();
    buntstift.info(`${command} - ${testCase}`);
    buntstift.newLine();

    await pre({ dirname: tempTestDirectory });

    const result = await runCommand({ cwd, command, directory: tempTestDirectory });

    /* eslint-disable global-require */
    const expected = require(path.join(cwd, command, testCase, 'expected.js'));
    /* eslint-enable global-require */

    assert.that(result.exitCode).is.equalTo(expected.exitCode);

    await expected.validate({ result, dirname: tempTestDirectory });
  });
};

module.exports = createTestForCommand;
