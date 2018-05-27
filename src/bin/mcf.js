#!/usr/bin/env node

'use strict';

const buntstift = require('buntstift'),
      commandLineCommands = require('command-line-commands');

const commands = require('../cli/commands');

const exit = function (ex) {
  buntstift.line();

  if (!ex) {
    buntstift.exit(0);

    return;
  }

  if (ex.message) {
    buntstift.verbose(ex.message);
  }

  if (ex.stack) {
    buntstift.verbose(ex.stack);
  }

  buntstift.exit(1);
};

(async function () {
  const validCommands = Object.keys(commands);

  let parsed;

  // const cwd = process.cwd();

  try {
    parsed = commandLineCommands([ null, ...validCommands ]);
  } catch (ex) {
    buntstift.error(`Unknown command '${ex.command}'`);
    buntstift.exit(1);
  }

  const command = commands[parsed.command];

  try {
    buntstift.header(`Running '${parsed.command}'`);

    await command.run();
  } catch (ex) {
    exit(ex);
  }

  exit();
})();
