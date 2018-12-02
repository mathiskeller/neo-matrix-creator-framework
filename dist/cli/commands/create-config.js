'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var path = require('path');

var buntstift = require('buntstift');

var config = require('../../create-config/.neoconfig.tpl.json'),
    file = require('../../file');

var command = {
  description: 'Creates the needed .neoconfig.json File.',
  run: function () {
    var _run = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var directory, defaultPorts, ports, content;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              directory = process.cwd(); // IP

              _context.next = 3;
              return buntstift.ask('What is your Matrix-Creator IP?');

            case 3:
              config.creator.ip = _context.sent;
              _context.next = 6;
              return buntstift.confirm('Use the default Ports?', true);

            case 6:
              defaultPorts = _context.sent;

              if (!(defaultPorts === false)) {
                _context.next = 58;
                break;
              }

              ports = config.creator.ports;
              _context.next = 11;
              return buntstift.ask("Microphone Port (empty for default ".concat(ports.Mic, "):"));

            case 11:
              _context.t0 = _context.sent;

              if (_context.t0) {
                _context.next = 14;
                break;
              }

              _context.t0 = ports.Mic;

            case 14:
              ports.Mic = _context.t0;
              _context.next = 17;
              return buntstift.ask("Everloop Port (empty for default ".concat(ports.Everloop, "):"));

            case 17:
              _context.t1 = _context.sent;

              if (_context.t1) {
                _context.next = 20;
                break;
              }

              _context.t1 = ports.Everloop;

            case 20:
              ports.Everloop = _context.t1;
              _context.next = 23;
              return buntstift.ask("Humidity Port (empty for default ".concat(ports.Humidity, "):"));

            case 23:
              _context.t2 = _context.sent;

              if (_context.t2) {
                _context.next = 26;
                break;
              }

              _context.t2 = ports.Humidity;

            case 26:
              ports.Humidity = _context.t2;
              _context.next = 29;
              return buntstift.ask("Pressure Port (empty for default ".concat(ports.Pressure, "):"));

            case 29:
              _context.t3 = _context.sent;

              if (_context.t3) {
                _context.next = 32;
                break;
              }

              _context.t3 = ports.Pressure;

            case 32:
              ports.Pressure = _context.t3;
              _context.next = 35;
              return buntstift.ask("Uv Port (empty for default ".concat(ports.Uv, "):"));

            case 35:
              _context.t4 = _context.sent;

              if (_context.t4) {
                _context.next = 38;
                break;
              }

              _context.t4 = ports.Uv;

            case 38:
              ports.Uv = _context.t4;
              _context.next = 41;
              return buntstift.ask("Imu Port (empty for default ".concat(ports.Imu, "):"));

            case 41:
              _context.t5 = _context.sent;

              if (_context.t5) {
                _context.next = 44;
                break;
              }

              _context.t5 = ports.Imu;

            case 44:
              ports.Imu = _context.t5;
              _context.next = 47;
              return buntstift.ask("Gpio Port (empty for default ".concat(ports.Gpio, "):"));

            case 47:
              _context.t6 = _context.sent;

              if (_context.t6) {
                _context.next = 50;
                break;
              }

              _context.t6 = ports.Gpio;

            case 50:
              ports.Gpio = _context.t6;
              _context.next = 53;
              return buntstift.ask("Lirc Port (empty for default ".concat(ports.Lirc, "):"));

            case 53:
              _context.t7 = _context.sent;

              if (_context.t7) {
                _context.next = 56;
                break;
              }

              _context.t7 = ports.Lirc;

            case 56:
              ports.Lirc = _context.t7;
              config.creator.ports = ports;

            case 58:
              // write config file
              content = JSON.stringify(config, null, '\t');
              _context.prev = 59;
              _context.next = 62;
              return file.write({
                path: path.join(directory, '.neoconfig.json'),
                content: content
              });

            case 62:
              _context.next = 67;
              break;

            case 64:
              _context.prev = 64;
              _context.t8 = _context["catch"](59);
              throw _context.t8;

            case 67:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[59, 64]]);
    }));

    return function run() {
      return _run.apply(this, arguments);
    };
  }()
};
module.exports = command;