'use strict';

const events = require('events'),
      path = require('path');

const buntstift = require('buntstift'),
      matrixIo = require('matrix-protos').matrix_io,
      zmq = require('zmq');

const config = require(path.join(process.cwd(), '.neoconfig.json'));

const EventEmitter = events.EventEmitter;

module.exports = class Uv extends EventEmitter {
  constructor (options) {
    super();

    const defaults = {
      name: 'UV',
      ip: config.creator.ip,
      port: config.creator.ports.Gpio,
      delayBetweenUpdates: 2.0,
      timeoutAfterLastPing: 6.0,
      pingInterval: 2000
    };

    this.options = Object.assign(defaults, options);

    // Configuration
    this.configSocket = zmq.socket('push');
    this.configSocket.connect(`tcp://${this.options.ip}:${this.options.port}`);

    const driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({
      delayBetweenUpdates: this.options.delayBetweenUpdates,
      timeoutAfterLastPing: this.options.timeoutAfterLastPing
    });

    this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish());

    this.update();
    this.ping();
    this.error();

    buntstift.info(`${this.options.name} initialized`);
  }

  update () {
    const updateSocket = zmq.socket('sub');

    updateSocket.connect(`tcp://${this.options.ip}:${this.options.port + 3}`);

    updateSocket.subscribe('');
    updateSocket.on('message', buffer => {
      const data = matrixIo.malos.v1.sense.UV.decode(buffer);

      this.emit('data', data);
      buntstift.info(`${this.options.name} | Message: ${JSON.stringify(data)}`);
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
      buntstift.error(`${this.options.name} | Error: ${err.toString('utf8')}`);
    });
  }
};
