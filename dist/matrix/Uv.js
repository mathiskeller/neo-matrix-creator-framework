'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var events = require('events'),
    path = require('path');

var matrixIo = require('matrix-protos').matrix_io,
    zmq = require('zmq');

var config = require(path.join(process.cwd(), '.neoconfig.json'));

var EventEmitter = events.EventEmitter;

var Uv =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Uv, _EventEmitter);

  function Uv(options) {
    var _this;

    (0, _classCallCheck2.default)(this, Uv);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Uv).call(this));
    var defaults = {
      name: 'UV',
      ip: config.creator.ip,
      port: config.creator.ports.Gpio,
      delayBetweenUpdates: 2.0,
      timeoutAfterLastPing: 6.0,
      pingInterval: 2000
    };
    _this.options = Object.assign(defaults, options); // Configuration

    _this.configSocket = zmq.socket('push');

    _this.configSocket.connect("tcp://".concat(_this.options.ip, ":").concat(_this.options.port));

    var driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({
      delayBetweenUpdates: _this.options.delayBetweenUpdates,
      timeoutAfterLastPing: _this.options.timeoutAfterLastPing
    });

    _this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish());

    _this.update();

    _this.ping();

    _this.error();

    return (0, _possibleConstructorReturn2.default)(_this, "".concat(_this.options.name, " initialized"));
  }

  (0, _createClass2.default)(Uv, [{
    key: "update",
    value: function update() {
      var _this2 = this;

      var updateSocket = zmq.socket('sub');
      updateSocket.connect("tcp://".concat(this.options.ip, ":").concat(this.options.port + 3));
      updateSocket.subscribe('');
      updateSocket.on('message', function (buffer) {
        var data = matrixIo.malos.v1.sense.UV.decode(buffer);

        _this2.emit('data', data);
      });
    }
  }, {
    key: "ping",
    value: function ping() {
      var pingSocket = zmq.socket('push');
      pingSocket.connect("tcp://".concat(this.options.ip, ":").concat(this.options.port + 1));
      pingSocket.send('');
      setInterval(function () {
        pingSocket.send('');
      }, this.options.pingInterval);
    }
  }, {
    key: "error",
    value: function error() {
      var _this3 = this;

      var errorSocket = zmq.socket('sub');
      errorSocket.connect("tcp://".concat(this.options.ip, ":").concat(this.options.port + 2));
      errorSocket.subscribe('');
      errorSocket.on('message', function (err) {
        _this3.emit('error', "".concat(_this3.options.name, " | socket error: ").concat(err.toString('utf8')));
      });
    }
  }]);
  return Uv;
}(EventEmitter);

module.exports = Uv;