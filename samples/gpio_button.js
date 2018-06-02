'use strict';

// Require modules
const buntstift = require('buntstift');
const path = require('path');
const neo = require(path.join(__dirname, '../src/matrix/'));

// Initialize modules
const gpio = new neo.Gpio();
const everloop = new neo.Everloop();

// Register button on gpio pin 0
gpio.button(0, 'light-switch');

// listen on light-switch
gpio.on('light-switch', state => {
  if (state === 'pressed') {
    buntstift.success('Switched Light');

    if (everloop.state === 'off') {
      everloop.fadeLight(everloop.generateGradient([
        { red: 0, green: 0, blue: 50, white: 0 },
        { red: 0, green: 50, blue: 10, white: 0 }
      ]));
    } else {
      everloop.fadeLight(everloop.generateDefaultLight(0, 0, 0, 0));
    }
  }
});
