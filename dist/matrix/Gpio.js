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

var Gpio =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Gpio, _EventEmitter);

  function Gpio(options) {
    var _this;

    (0, _classCallCheck2.default)(this, Gpio);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Gpio).call(this));
    var defaults = {
      name: 'GPIO',
      ip: config.creator.ip,
      port: config.creator.ports.Gpio,
      delayBetweenUpdates: 0.250,
      timeoutAfterLastPing: 2.0,
      pingInterval: 2000
    };
    _this.options = Object.assign(defaults, options);
    _this.PINS = {};
    _this.configSocket = zmq.socket('push');

    _this.configSocket.connect("tcp://".concat(_this.options.ip, ":").concat(_this.options.port));

    _this.error().error(function (err) {
      throw err;
    });

    _this.update();

    _this.ping();

    return (0, _possibleConstructorReturn2.default)(_this, "".concat(_this.options.name, " initialized"));
  }

  (0, _createClass2.default)(Gpio, [{
    key: "button",
    value: function button(_ref) {
      var _this2 = this;

      var pin = _ref.pin,
          name = _ref.name;
      this.setInputPin({
        pin: pin,
        type: 'button',
        name: name
      });
      this.on('pin_change', function (res) {
        // skip if pin isn't a button
        if (res.pin.type !== 'button') {
          return;
        } // Check if Pressed or Released and emit button event


        if (res.value === 1) {
          _this2.emit("".concat(name), 'pressed');
        } else {
          _this2.emit("".concat(name), 'released');
        } // Update the value of the pin


        res.pin.value = res.value;
      });
    }
  }, {
    key: "setOutputPin",
    value: function setOutputPin(_ref2) {
      var pin = _ref2.pin,
          type = _ref2.type,
          name = _ref2.name,
          value = _ref2.value;
      // Create GPIO Params
      var gpioParams = matrixIo.malos.v1.io.GpioParams.create({
        pin: pin,
        mode: matrixIo.malos.v1.io.GpioParams.EnumMode.OUTPUT,
        value: value
      });
      var driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({
        gpio: gpioParams
      });
      this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish()); // update pin array

      this.PINS["pin_".concat(pin)] = {
        pin: pin,
        mode: gpioParams.mode,
        type: type,
        name: name,
        value: value
      };
      return "".concat(this.options.name, " | Updated Output Pin: ").concat(JSON.stringify(this.PINS["pin_".concat(pin)]));
    }
  }, {
    key: "setInputPin",
    value: function setInputPin(_ref3) {
      var pin = _ref3.pin,
          type = _ref3.type,
          name = _ref3.name;
      // Create GPIO Params
      var gpioParams = matrixIo.malos.v1.io.GpioParams.create({
        pin: pin,
        mode: matrixIo.malos.v1.io.GpioParams.EnumMode.INPUT,
        value: 0
      });
      var driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({
        delayBetweenUpdates: this.options.delayBetweenUpdates,
        timeoutAfterLastPing: this.options.timeoutAfterLastPing,
        gpio: gpioParams
      });
      this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish());
      this.PINS["pin_".concat(pin)] = {
        pin: pin,
        mode: gpioParams.mode,
        type: type,
        name: name,
        value: 0
      };
      return "".concat(this.options.name, " | Registered Input Pin: ").concat(JSON.stringify(this.PINS["pin_".concat(pin)]));
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
    key: "update",
    value: function update() {
      var _this3 = this;

      var updateSocket = zmq.socket('sub');
      updateSocket.connect("tcp://".concat(this.options.ip, ":").concat(this.options.port + 3));
      updateSocket.subscribe('');
      updateSocket.on('message', function (buffer) {
        var data = matrixIo.malos.v1.io.GpioParams.decode(buffer);

        var valueString = _this3.dec2bin(data.values); // Debug Usage
        // buntstift.info(`${this.options.name} | Pins register: `, this.dec2bin(data.values));


        for (var i = valueString.length - 1; i >= 0; i--) {
          var pin = valueString.length - 1 - i; // check if pin is in pins object

          if (_this3.PINS["pin_".concat(pin)] !== undefined) {
            var value = parseInt(valueString[i], 10); // only emit on change

            if (_this3.PINS["pin_".concat(pin)].value !== value) {
              _this3.emit('pin_change', {
                pin: _this3.PINS["pin_".concat(pin)],
                value: value
              });
            }
          }
        }
      });
    }
  }, {
    key: "error",
    value: function error() {
      var _this4 = this;

      var errorSocket = zmq.socket('sub');
      errorSocket.connect("tcp://".concat(this.options.ip, ":").concat(this.options.port + 2));
      errorSocket.subscribe('');
      errorSocket.on('message', function (err) {
        _this4.emit('error', "".concat(_this4.options.name, " | socket error: ").concat(err.toString('utf8')));
      });
    }
    /*  eslint-disable */

  }, {
    key: "dec2bin",
    value: function dec2bin(dec) {
      return (dec >>> 0).toString(2);
    }
    /*  eslint-enable */

  }]);
  return Gpio;
}(EventEmitter);

module.exports = Gpio;