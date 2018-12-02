#!/usr/bin/env node
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var buntstift = require('buntstift'),
    commandLineCommands = require('command-line-commands');

var commands = require('../cli/commands');

var exit = function exit(ex) {
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

(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var validCommands, parsed, command;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          validCommands = Object.keys(commands);

          // const cwd = process.cwd();
          try {
            parsed = commandLineCommands([null].concat((0, _toConsumableArray2.default)(validCommands)));
          } catch (ex) {
            buntstift.error("Unknown command '".concat(ex.command, "'"));
            buntstift.exit(1);
          }

          command = commands[parsed.command];
          _context.prev = 3;
          buntstift.header("Running '".concat(parsed.command, "'"));
          _context.next = 7;
          return command.run();

        case 7:
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          exit(_context.t0);

        case 12:
          exit();

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[3, 9]]);
}))();