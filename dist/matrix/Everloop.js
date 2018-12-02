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

var Everloop =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Everloop, _EventEmitter);

  function Everloop(options) {
    var _this;

    (0, _classCallCheck2.default)(this, Everloop);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Everloop).call(this));
    var defaults = {
      name: 'EVERLOOP',
      ip: config.creator.ip,
      port: config.creator.ports.Everloop,
      leds: 35
    };
    _this.options = Object.assign(defaults, options);
    _this.currentLight = _this.generateDefaultLight(0, 0, 0, 0);
    _this.previousLight = _this.generateDefaultLight(0, 0, 0, 0);
    _this.state = 'off';
    _this.configSocket = zmq.socket('push');

    _this.configSocket.connect("tcp://".concat(_this.options.ip, ":").concat(_this.options.port));

    _this.error();

    _this.switchLight(_this.currentLight);

    return _this;
  }

  (0, _createClass2.default)(Everloop, [{
    key: "off",
    value: function off() {
      this.fadeLight(this.generateDefaultLight(0, 0, 0, 0));
      return true;
    }
  }, {
    key: "generateGradient",
    value: function generateGradient(colors) {
      var _this2 = this;

      var gradient = [];
      var sectionLeds = Math.abs(this.options.leds / colors.length); // Add the start color to generate a smooth circle

      colors.push(colors[0]);

      var _loop = function _loop(j) {
        var _loop2 = function _loop2(i) {
          var color = {
            red: 0,
            green: 0,
            blue: 0,
            white: 0
          };
          Object.keys(color).forEach(function (val) {
            var diff = colors[j + 1][val] - colors[j][val];
            var step = diff / _this2.options.leds;
            var newVal = Math.floor(colors[j][val] + i * step);

            if (step < 0) {
              color[val] = Math.max(colors[j + 1][val], newVal);
            } else {
              color[val] = Math.min(colors[j + 1][val], newVal);
            }
          });

          if (gradient.length < _this2.options.leds) {
            gradient.push(color);
          }
        };

        for (var i = 0; i < sectionLeds; ++i) {
          _loop2(i);
        }
      };

      for (var j = 0; j < colors.length - 1; ++j) {
        _loop(j);
      }

      return gradient;
    }
  }, {
    key: "generateDefaultLight",
    value: function generateDefaultLight(red, green, blue, white) {
      if (red < 0 || red > 100) {
        this.emit('error', "".concat(this.options.name, " | generateDefaultLight(): Red needs to be between 0 and 100"));
      }

      if (green < 0 || green > 100) {
        this.emit('error', "".concat(this.options.name, " | generateDefaultLight(): Green needs to be between 0 and 100"));
      }

      if (blue < 0 || blue > 100) {
        this.emit('error', "".concat(this.options.name, " | generateDefaultLight(): Blue needs to be between 0 and 100"));
      }

      if (white < 0 || white > 100) {
        this.emit('error', "".concat(this.options.name, " | generateDefaultLight(): White needs to be between 0 and 100"));
      }

      var light = [];

      for (var i = 0; i < this.options.leds; ++i) {
        light.push({
          red: red,
          green: green,
          blue: blue,
          white: white
        });
      }

      return light;
    }
  }, {
    key: "switchLight",
    value: function switchLight(light) {
      this.stopFade();
      this.storePreviousLight();
      this.setLight(light);
      return true;
    }
  }, {
    key: "fadeLight",
    value: function fadeLight(light) {
      var _this3 = this;

      var intervalTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      this.stopFade();
      this.storePreviousLight();
      this.interval = setInterval(function () {
        var newLight = [];
        var finished = true;

        var _loop3 = function _loop3(i) {
          newLight.push({
            red: 0,
            green: 0,
            blue: 0,
            white: 0
          });
          /*  eslint-disable */

          Object.keys(_this3.currentLight[i]).forEach(function (color) {
            if (_this3.currentLight[i][color] > light[i][color]) {
              newLight[i][color] = _this3.currentLight[i][color] - 1;
            } else if (_this3.currentLight[i][color] < light[i][color]) {
              newLight[i][color] = _this3.currentLight[i][color] + 1;
            } else {
              newLight[i][color] = _this3.currentLight[i][color];
            }

            if (newLight[i][color] !== light[i][color]) {
              finished = false;
            }
          });
          /*  eslint-enable */
        };

        for (var i = 0; i < _this3.options.leds; ++i) {
          _loop3(i);
        }

        _this3.setLight(newLight);

        if (finished) {
          _this3.stopFade();

          return true;
        }
      }, intervalTime);
    }
  }, {
    key: "stopFade",
    value: function stopFade() {
      clearInterval(this.interval);
      return true;
    }
  }, {
    key: "updateState",
    value: function updateState() {
      var state = this.state;

      if (JSON.stringify(this.currentLight) === JSON.stringify(this.generateDefaultLight(0, 0, 0, 0))) {
        state = 'off';
      } else {
        state = 'on';
      }

      return state;
    }
  }, {
    key: "storePreviousLight",
    value: function storePreviousLight() {
      this.previousLight = this.currentLight;
      return this.previousLight;
    }
  }, {
    key: "setLight",
    value: function setLight(light) {
      try {
        var image = matrixIo.malos.v1.io.EverloopImage.create(); // save the new light in currentLight

        this.currentLight = light;

        for (var i = 0; i < this.options.leds; ++i) {
          var ledValue = matrixIo.malos.v1.io.LedValue.create({
            red: Math.max(0, light[i].red),
            green: Math.max(0, light[i].green),
            blue: Math.max(0, light[i].blue),
            white: Math.max(0, light[i].white)
          });
          image.led.push(ledValue);
        }

        var driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({
          image: image
        });
        this.state = this.updateState();
        this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish());
      } catch (ex) {
        this.emit('error', "".concat(this.options.name, " | setLight(): Failed to set light on everloop - ").concat(ex.message));
      }

      return true;
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
  }]);
  return Everloop;
}(EventEmitter);

module.exports = Everloop;