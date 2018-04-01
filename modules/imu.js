'use strict';

const buntstift = require('buntstift');
const zmq = require('zmq');
const matrixIo = require('matrix-protos').matrix_io;
const events = require('events');

const EventEmitter = events.EventEmitter;

module.exports = class Imu extends EventEmitter {
  constructor (options) {
    super();

    const defaults = {
      name: 'IMU',
      ip: '127.0.0.1',
      port: 20013,
      delayBetweenUpdates: 2.0,
      timeoutAfterLastPing: 6.0,
      pingInterval: 2000
    };

    this.options = Object.assign({}, defaults, options);

    // Configuration
    this.configSocket = zmq.socket('push');
    this.configSocket.connect(`tcp://${this.options.ip}:${this.options.port}`);

    this.config = matrixIo.malos.v1.driver.DriverConfig.create({
      delayBetweenUpdates: this.options.delayBetweenUpdates,
      timeoutAfterLastPing: this.options.timeoutAfterLastPing
    });
    this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(this.config).finish());

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
      const data = matrixIo.malos.v1.sense.Imu.decode(buffer);

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
