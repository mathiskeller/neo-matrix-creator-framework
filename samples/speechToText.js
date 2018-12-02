'use strict';

const buntstift = require('buntstift');
const path = require('path');
const neo = require(path.join(__dirname, '../src/matrix/'));

const speechToText = new neo.SpeechToText({
  projectId: 'limbus-v2',
  device: 'mic_channel0',
  recordProgram: 'arecord',
  language: 'de-DE'
});

speechToText.start();
buntstift.header(speechToText.state);

speechToText.on('error', err => {
  buntstift.error(err);
});

speechToText.on('stream', res => {
  buntstift.info(res);
});

speechToText.on('final-result', res => {
  buntstift.success(res);
});
