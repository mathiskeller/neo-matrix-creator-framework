'use strict';

const path = require('path');

const shell = require('shelljs');

const runCommand = function ({ cwd, command, directory }) {
  return new Promise((resolve, reject) => {
    if (!cwd) {
      return reject(new Error('Cwd is missing.'));
    }
    if (!command) {
      return reject(new Error('Command is missing.'));
    }
    if (!directory) {
      return reject(new Error('Directory is missing.'));
    }

    let input;

    try {
      /* eslint-disable global-require */
      input = require(path.join(directory, 'input.js'));
      /* eslint-enable global-require */
    } catch (ex) {
      input = {};
    }

    const pathToCli = path.join(cwd, '..', '..', 'src', 'bin', 'neo.js');

    const child = shell.exec(`node ${pathToCli} ${command}`, {
      cwd: directory,
      async: true
    });

    child.once('close', exitCode => {
      resolve({
        exitCode
      });
    });

    const keys = {
      up: '\u001B\u005B\u0041',
      down: '\u001B\u005B\u0042',
      enter: '\r'
    };

    const inputs = input({ keys });

    inputs.forEach((inputString, index) => {
      setTimeout(() => {
        child.stdin.write(inputString);
      }, 500 * index);
    });
  });
};

module.exports = runCommand;
