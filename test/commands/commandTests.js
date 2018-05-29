'use strict';

const fs = require('fs'),
      path = require('path');

const processenv = require('processenv'),
      shell = require('shelljs');

const helpers = require('../helpers');

const tempDirectory = path.join(__dirname, 'temp');

const createTestsForCommand = function ({ command, testCases }) {
  /* eslint-disable no-sync */
  if (!testCases) {
    testCases = fs.readdirSync(path.join(__dirname, command));
  }
  /* eslint-enable no-sync */

  /* eslint-disable no-sync */
  testCases.forEach(testCase => {
    const testCaseDirectory = path.join(__dirname, command, testCase);

    if (!fs.statSync(testCaseDirectory).isDirectory()) {
      return;
    }
    if (testCase.startsWith('_')) {
      return;
    }

    helpers.createTestForCommand({
      cwd: __dirname,
      command,
      testCase,
      tempDirectory
    });
  });
  /* eslint-enalbe no-sync */
};

suite('commands', function () {
  this.timeout(90 * 1000);

  setup(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  teardown(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  let only = processenv('ONLY');

  if (only) {
    let command = only,
        testCases;

    if (only.includes('/')) {
      only = only.split('/');
      command = only[0];
      testCases = [ only[1] ];
    }

    suite(command, () => {
      createTestsForCommand({ command, testCases });
    });

    return;
  }

  /* eslint-disable no-sync */
  fs.readdirSync(__dirname).forEach(command => {
    if (!fs.statSync(path.join(__dirname, command)).isDirectory()) {
      return;
    }
    if (command === 'temp') {
      return;
    }

    suite(command, () => {
      createTestsForCommand({ command });
    });
  });
  /* eslint-enalbe no-sync */
});
