'use strict';

const events = require('events'),
      path = require('path');

const matrixIo = require('matrix-protos').matrix_io,
      zmq = require('zmq');

const config = require(path.join(process.cwd(), '.neoconfig.json'));

const EventEmitter = events.EventEmitter;

module.exports = class Humidity extends EventEmitter {
  constructor (options) {
    super();

    const defaults = {
      name: 'HUMIDITY',
      ip: config.creator.ip,
      port: config.creator.ports.Gpio,
      delayBetweenUpdates: 2.0,
      timeoutAfterLastPing: 6.0,
      calibrationTemperature: 23,
      pingInterval: 2000
    };

    this.options = Object.assign(defaults, options);

    // Configuration
    this.configSocket = zmq.socket('push');
    this.configSocket.connect(`tcp://${this.options.ip}:${this.options.port}`);

    const driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({
      delayBetweenUpdates: this.options.delayBetweenUpdates,
      timeoutAfterLastPing: this.options.timeoutAfterLastPing,
      humidity: matrixIo.malos.v1.sense.HumidityParams.create({
        currentTemperature: this.options.calibrationTemperature
      })
    });

    this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish());

    this.update();
    this.ping();
    this.error();

    return `${this.options.name} initialized`;
  }

  update () {
    const updateSocket = zmq.socket('sub');

    updateSocket.connect(`tcp://${this.options.ip}:${this.options.port + 3}`);

    updateSocket.subscribe('');
    updateSocket.on('message', buffer => {
      const data = matrixIo.malos.v1.sense.Humidity.decode(buffer);

      this.emit('data', data);
    });
  }

  ping () {
    const pingSocket = zmq.socket('push');

    pingSocket.connect(`tcp://${this.options.ip}:${this.options.port + 1}`);

    pingSocket.send('');
    setInterval(() => {
      pingSocket.send('');
    }, this.options.pingInterval);
  }

  error () {
    const errorSocket = zmq.socket('sub');

    errorSocket.connect(`tcp://${this.options.ip}:${this.options.port + 2}`);

    errorSocket.subscribe('');
    errorSocket.on('message', err => {
      this.emit('error', `${this.options.name} | socket error: ${err.toString('utf8')}`);
    });
  }
};
