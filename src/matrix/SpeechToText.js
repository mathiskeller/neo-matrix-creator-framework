'use strict';

const events = require('events'),
      fs = require('fs'),
      path = require('path');

const googleSpeech = require('@google-cloud/speech'),
      record = require('node-record-lpcm16');

const EventEmitter = events.EventEmitter;

module.exports = class SpeechToText extends EventEmitter {
  constructor (options) {
    super();

    const defaults = {
      name: 'STT',
      projectId: undefined,
      device: 'default',
      language: 'en-US',
      recordProgram: 'arecord',
      encoding: 'LINEAR16',
      sampleRate: 16000
    };

    this.options = Object.assign(defaults, options);

    if (this.options.projectId === undefined) {
      this.emit('error', `${this.options.name} | You have to add a projectId to use this module`);
    }

    this.state = 'stopped';
    this.recognizeSpeech();
  }

  microphoneTest () {
    const file = fs.createWriteStream(path.join(process.cwd(), 'test.wav'), { encoding: 'binary' });

    record.start({
      sampleRateHertz: this.options.sampleRate,
      threshold: 0,
      verbose: false,
      device: this.options.device,
      recordProgram: this.options.recordProgram,
      silence: '5.0'
    }).pipe(file);

    setTimeout(() => {
      record.stop();
    }, 3000);
  }

  recognizeSpeech () {
    this.speechClient = new googleSpeech.SpeechClient({
      projectId: this.options.projectId,
      keyFilename: path.join(process.cwd(), 'keyfile.json')
    });

    const requestConfig = {
      config: {
        encoding: this.options.encoding,
        sampleRateHertz: this.options.sampleRate,
        languageCode: this.options.language
      },
      interimResults: true
    };

    this.recognizeStream = this.speechClient.streamingRecognize(requestConfig).
      on('error', error => {
        this.emit('error', error);
      }).
      on('data', data => {
        const isFinal = data.results[0].isFinal;
        const result = data.results[0].alternatives[0];

        if (isFinal === true) {
          this.emit('final-result', result.transcript);
          this.stop();
        } else {
          this.emit('stream', result.transcript);
        }
      });
  }

  start () {
    if (this.state !== 'stopped') {
      this.emit('error', `${this.options.name} | The record is already running`);

      return false;
    }

    record.start({
      sampleRateHertz: this.options.sampleRate,
      threshold: 0,
      verbose: false,
      device: this.options.device,
      recordProgram: this.options.recordProgram,
      silence: '5.0'
    }).
      on('error', error => {
        this.emit('error', error);
      }).
      pipe(this.recognizeStream);

    this.state = 'recording';

    this.emit('state', this.state);

    return this.state;
  }

  stop () {
    if (this.state !== 'recording') {
      this.emit('error', `${this.options.name} | The record isn't running`);

      return false;
    }

    record.stop();
    this.state = 'stopped';

    this.emit('state', this.state);

    return this.state();
  }
};
