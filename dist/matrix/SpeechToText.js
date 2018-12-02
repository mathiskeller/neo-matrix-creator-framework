'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var events = require('events'),
    fs = require('fs'),
    path = require('path');

var googleSpeech = require('@google-cloud/speech'),
    record = require('node-record-lpcm16');

var EventEmitter = events.EventEmitter;

var SpeechToText =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(SpeechToText, _EventEmitter);

  function SpeechToText(options) {
    var _this;

    (0, _classCallCheck2.default)(this, SpeechToText);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SpeechToText).call(this));
    var defaults = {
      name: 'STT',
      projectId: undefined,
      device: 'default',
      language: 'en-US',
      recordProgram: 'arecord',
      encoding: 'LINEAR16',
      sampleRate: 16000
    };
    _this.options = Object.assign(defaults, options);

    if (_this.options.projectId === undefined) {
      _this.emit('error', "".concat(_this.options.name, " | You have to add a projectId to use this module"));
    }

    _this.state = 'stopped';

    _this.recognizeSpeech();

    return _this;
  }

  (0, _createClass2.default)(SpeechToText, [{
    key: "microphoneTest",
    value: function microphoneTest() {
      var file = fs.createWriteStream(path.join(process.cwd(), 'test.wav'), {
        encoding: 'binary'
      });
      record.start({
        sampleRateHertz: this.options.sampleRate,
        threshold: 0,
        verbose: false,
        device: this.options.device,
        recordProgram: this.options.recordProgram,
        silence: '5.0'
      }).pipe(file);
      setTimeout(function () {
        record.stop();
      }, 3000);
    }
  }, {
    key: "recognizeSpeech",
    value: function recognizeSpeech() {
      var _this2 = this;

      this.speechClient = new googleSpeech.SpeechClient({
        projectId: this.options.projectId,
        keyFilename: path.join(process.cwd(), 'keyfile.json')
      });
      var requestConfig = {
        config: {
          encoding: this.options.encoding,
          sampleRateHertz: this.options.sampleRate,
          languageCode: this.options.language
        },
        interimResults: true
      };
      this.recognizeStream = this.speechClient.streamingRecognize(requestConfig).on('error', function (error) {
        _this2.emit('error', error);
      }).on('data', function (data) {
        var isFinal = data.results[0].isFinal;
        var result = data.results[0].alternatives[0];

        if (isFinal === true) {
          _this2.emit('final-result', result.transcript);

          _this2.stop();
        } else {
          _this2.emit('stream', result.transcript);
        }
      });
    }
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;

      if (this.state !== 'stopped') {
        this.emit('error', "".concat(this.options.name, " | The record is already running"));
        return false;
      }

      record.start({
        sampleRateHertz: this.options.sampleRate,
        threshold: 0,
        verbose: false,
        device: this.options.device,
        recordProgram: this.options.recordProgram,
        silence: '5.0'
      }).on('error', function (error) {
        _this3.emit('error', error);
      }).pipe(this.recognizeStream);
      this.state = 'recording';
      this.emit('state', this.state);
      return this.state;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.state !== 'recording') {
        this.emit('error', "".concat(this.options.name, " | The record isn't running"));
        return false;
      }

      record.stop();
      this.state = 'stopped';
      this.emit('state', this.state);
      return this.state;
    }
  }]);
  return SpeechToText;
}(EventEmitter);

module.exports = SpeechToText;