'use strict';

const buntstift = require('buntstift');
const matrixIo = require('matrix-protos').matrix_io;
const zmq = require('zmq');
const events = require('events');

const EventEmitter = events.EventEmitter;

module.exports = class Gpio extends EventEmitter {
  constructor (options) {
    super();

    const defaults = {
      name: 'GPIO',
      ip: '127.0.0.1',
      port: 20049,
      delayBetweenUpdates: 0.250,
      timeoutAfterLastPing: 2.0,
      pingInterval: 2000
    };

    this.options = Object.assign({}, defaults, options);

    this.PINS = {};

    this.configSocket = zmq.socket('push');
    this.configSocket.connect(`tcp://${this.options.ip}:${this.options.port}`);

    this.error();
    this.update();
    this.ping();

    buntstift.info(`${this.options.name} initialized`);
  }

  button (index, name) {
    this.setInputPin(index, 'button', name);

    this.on('pin_change', res => {
      // skip if pin isn't a button
      if (res.pin.type !== 'button') {
        return;
      }

      // Check if Pressed or Released and emit button event
      if (res.value === 1) {
        this.emit(`${name}`, 'pressed');
      } else {
        this.emit(`${name}`, 'released');
      }

      // Update the value of the pin
      res.pin.value = res.value;
    });
  }

  setOutputPin (index, type, name, value) {
    // Create GPIO Params
    const gpioParams = matrixIo.malos.v1.io.GpioParams.create({
      pin: index,
      mode: matrixIo.malos.v1.io.GpioParams.EnumMode.OUTPUT,
      value: value
    });

    const config = matrixIo.malos.v1.driver.DriverConfig.create({
      gpio: gpioParams
    });

    this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(config).finish());

    // update pin array
    this.PINS[`pin_${index}`] = {
      index: index,
      mode: gpioParams.mode,
      type: type,
      name: name,
      value: value
    };

    buntstift.info(`${this.options.name} | Updated Output Pin: ${JSON.stringify(this.PINS[`pin_${index}`])}`);
  }

  setInputPin (index, type, name) {
    // Create GPIO Params
    const gpioParams = matrixIo.malos.v1.io.GpioParams.create({
      pin: index,
      mode: matrixIo.malos.v1.io.GpioParams.EnumMode.INPUT,
      value: 0
    });

    const config = matrixIo.malos.v1.driver.DriverConfig.create({
      delayBetweenUpdates: this.options.delayBetweenUpdates,
      timeoutAfterLastPing: this.options.timeoutAfterLastPing,
      gpio: gpioParams
    });

    this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(config).finish());

    this.PINS[`pin_${index}`] = {
      index: index,
      mode: gpioParams.mode,
      type: type,
      name: name,
      value: 0
    };

    buntstift.info(`${this.options.name} | Registered Input Pin: ${JSON.stringify(this.PINS[`pin_${index}`])}`);
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

  update () {
    const updateSocket = zmq.socket('sub');

    updateSocket.connect(`tcp://${this.options.ip}:${this.options.port + 3}`);

    updateSocket.subscribe('');
    updateSocket.on('message', buffer => {
      const data = matrixIo.malos.v1.io.GpioParams.decode(buffer);
      const valueString = this.dec2bin(data.values);

      // Debug Usage
      // buntstift.info(`${this.options.name} | Pins register: `, this.dec2bin(data.values));

      for (let i = valueString.length - 1; i >= 0; i--) {
        const pin = valueString.length - 1 - i;

        // check if pin is in pins object
        if (this.PINS[`pin_${pin}`] !== undefined) {
          const value = parseInt(valueString[i], 10);

          // only emit on change
          if (this.PINS[`pin_${pin}`].value !== value) {
            this.emit('pin_change', { pin: this.PINS[`pin_${pin}`], value: value });
          }
        }
      }
    });
  }

  /*  eslint-disable */
  dec2bin (dec) {
    return (dec >>> 0).toString(2);
  }
  /*  eslint-enable */
};
