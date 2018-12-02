'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var fs = require('fs');

var promisify = require('util.promisify');

var writeFile = promisify(fs.writeFile);

var write =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var _ref2,
        path,
        content,
        encoding,
        _args = arguments;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, path = _ref2.path, content = _ref2.content, encoding = _ref2.encoding;

            if (path) {
              _context.next = 3;
              break;
            }

            throw new Error('Path is missing.');

          case 3:
            if (content) {
              _context.next = 5;
              break;
            }

            throw new Error('Content is missing.');

          case 5:
            _context.next = 7;
            return writeFile(path, content, encoding || 'utf8');

          case 7:
            return _context.abrupt("return", _context.sent);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function write() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = write;