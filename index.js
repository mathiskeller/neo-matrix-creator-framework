'use strict';

// require modules
const path = require('path');

const Everloop = require(path.join(__dirname, 'modules/everloop'));
const Gpio = require(path.join(__dirname, 'modules/gpio'));
const Humidity = require(path.join(__dirname, 'modules/humidity'));
const Imu = require(path.join(__dirname, 'modules/imu'));
const Pressure = require(path.join(__dirname, 'modules/pressure'));
const Uv = require(path.join(__dirname, 'modules/uv'));

const MatrixCreatorNodeFramework = {
  Everloop: Everloop,
  Gpio: Gpio,
  Humidity: Humidity,
  Imu: Imu,
  Pressure: Pressure,
  Uv: Uv
};

module.exports = MatrixCreatorNodeFramework;
