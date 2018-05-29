'use strict';

const path = require('path');

const buntstift = require('buntstift');

const config = require('../../create-config/.neoconfig.tpl.json'),
      file = require('../../file');

const command = {
  description: 'Creates the needed .neoconfig.json File.',

  async run () {
    const directory = process.cwd();

    // IP
    config.creator.ip = await buntstift.ask('What is your Matrix-Creator IP?');

    const defaultPorts = await buntstift.confirm('Use the default Ports?', true);

    if (defaultPorts === false) {
      const ports = config.creator.ports;

      ports.Mic = await buntstift.ask(`Microphone Port (empty for default ${ports.Mic}):`) || ports.Mic;
      ports.Everloop = await buntstift.ask(`Everloop Port (empty for default ${ports.Everloop}):`) || ports.Everloop;
      ports.Humidity = await buntstift.ask(`Humidity Port (empty for default ${ports.Humidity}):`) || ports.Humidity;
      ports.Pressure = await buntstift.ask(`Pressure Port (empty for default ${ports.Pressure}):`) || ports.Pressure;
      ports.Uv = await buntstift.ask(`Uv Port (empty for default ${ports.Uv}):`) || ports.Uv;
      ports.Imu = await buntstift.ask(`Imu Port (empty for default ${ports.Imu}):`) || ports.Imu;
      ports.Gpio = await buntstift.ask(`Gpio Port (empty for default ${ports.Gpio}):`) || ports.Gpio;
      ports.Lirc = await buntstift.ask(`Lirc Port (empty for default ${ports.Lirc}):`) || ports.Lirc;

      config.creator.ports = ports;
    }

    // write config file
    const content = JSON.stringify(config, null, '\t');

    try {
      await file.write({ path: path.join(directory, '.neoconfig.json'), content });
    } catch (ex) {
      throw ex;
    }
  }
};

module.exports = command;
