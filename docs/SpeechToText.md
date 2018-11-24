# SpeechToText Module

The SpeechToText (STT) module is connected the the Microphone-Array of the Matrix Creator and requires [Google Cloud Speech](https://cloud.google.com/speech-to-text/).


## Dependencies
You need to have SOX installed. See the [node-record-lpcm16](https://www.npmjs.com/package/node-record-lpcm16) for further information.

On Mac OS:
```
brew install sox
```

On Raspberry Pi:
```
sudo apt-get install sox libsox-fmt-all
```


## Quickstart

1. You have to create a new or use an existing Google Cloud Speech Project
2. Make sure that you copy the `keyfile.json` of your google cloud speech project in the project main folder first.

For testing on the mac:

```javascript
const neo = require('neo-matrix-creator-framework');

const speechToText = new neo.SpeechToText({
  projectId: '<The Project ID of Google-Cloud-Speech>'
});
```

For running on the Raspberry PI you have to setup the device (for e.g. mic_channel8) and record program

```javascript
const neo = require('neo-matrix-creator-framework');

const speechToText = new neo.SpeechToText({
  projectId: '<The Project ID of Google-Cloud-Speech>',
  device: 'mic_channel8',
  recordProgram: 'arecord'
});
```

If you want to make sure that your microphone is working run `speechToText.microphoneTest()` to record the audio input into a `test.wav` file in your working directory.


## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const speechToText = new neo.SpeechToText({
  name: 'STT',
  projectID: '<The Project ID of Google Cloud Speech>',
  device: 'default' || 'mic_channel8',
  recordProgram: 'rec' || 'arecord',
  language: 'en-US',
  sampleRate: 16000
});
```

## Parameters

```javascript
speechToText.state // stores the current state ('recording', 'stopped')
```

## Methods

```javascript
speechToText.start() // starts the recording
speechToText.stop() // stops recording
speechToText.microphoneTest() // test your microphone and receive a test.wav file in the working directory
```

## EventListener

To listen to the events emitted by the module use following sample code:

```javascript
// Returns the final result from the request
speechToText.on('final-result', result => {
  console.log(result);
})

// streams the transcription
speechToText.on('stream', result => {
  console.log(result);
})

// listen on a state change
speechToText.on('state', result => {
  console.log(result);
})

// Returns all errors
speechToText.on('error', err => {
  console.log(err);
});
```
