'use strict';

// Require modules
const path = require('path');
const buntstift = require('buntstift');
const neo = require(path.join(__dirname, '../src/matrix/'));

// Initialize modules
const everloop = new neo.Everloop();

everloop.off();

everloop.fadeLight(everloop.generateGradient([
  { red: 0, green: 0, blue: 50, white: 0 },
  { red: 0, green: 50, blue: 10, white: 0 }
]));

buntstift.success('Turned light on');
