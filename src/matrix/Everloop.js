'use strict';

const events = require('events'),
      path = require('path');

const matrixIo = require('matrix-protos').matrix_io,
      zmq = require('zmq');

const config = require(path.join(process.cwd(), '.neoconfig.json'));

const EventEmitter = events.EventEmitter;

module.exports = class Everloop extends EventEmitter {
  constructor (options) {
    super();

    const defaults = {
      name: 'EVERLOOP',
      ip: config.creator.ip,
      port: config.creator.ports.Everloop,
      leds: 35
    };

    this.options = Object.assign(defaults, options);

    this.currentLight = this.generateDefaultLight(0, 0, 0, 0);
    this.previousLight = this.generateDefaultLight(0, 0, 0, 0);
    this.state = 'off';

    this.configSocket = zmq.socket('push');
    this.configSocket.connect(`tcp://${this.options.ip}:${this.options.port}`);

    this.error();
    this.switchLight(this.currentLight);
  }

  off () {
    this.fadeLight(this.generateDefaultLight(0, 0, 0, 0));

    return true;
  }

  generateGradient (colors) {
    const gradient = [];
    const sectionLeds = Math.abs(this.options.leds / colors.length);

    // Add the start color to generate a smooth circle
    colors.push(colors[0]);

    for (let j = 0; j < colors.length - 1; ++j) {
      for (let i = 0; i < sectionLeds; ++i) {
        const color = { red: 0, green: 0, blue: 0, white: 0 };

        Object.keys(color).forEach(val => {
          const diff = colors[j + 1][val] - colors[j][val];
          const step = diff / this.options.leds;
          const newVal = Math.floor(colors[j][val] + i * step);

          if (step < 0) {
            color[val] = Math.max(colors[j + 1][val], newVal);
          } else {
            color[val] = Math.min(colors[j + 1][val], newVal);
          }
        });

        if (gradient.length < this.options.leds) {
          gradient.push(color);
        }
      }
    }

    return gradient;
  }

  generateDefaultLight (red, green, blue, white) {
    if (red < 0 || red > 100) {
      this.emit('error', `${this.options.name} | generateDefaultLight(): Red needs to be between 0 and 100`);
    }

    if (green < 0 || green > 100) {
      this.emit('error', `${this.options.name} | generateDefaultLight(): Green needs to be between 0 and 100`);
    }

    if (blue < 0 || blue > 100) {
      this.emit('error', `${this.options.name} | generateDefaultLight(): Blue needs to be between 0 and 100`);
    }

    if (white < 0 || white > 100) {
      this.emit('error', `${this.options.name} | generateDefaultLight(): White needs to be between 0 and 100`);
    }

    const light = [];

    for (let i = 0; i < this.options.leds; ++i) {
      light.push({ red, green, blue, white });
    }

    return light;
  }

  switchLight (light) {
    this.stopFade();
    this.storePreviousLight();

    this.setLight(light);

    return true;
  }

  fadeLight (light, intervalTime = 2) {
    this.stopFade();
    this.storePreviousLight();

    this.interval = setInterval(() => {
      const newLight = [];
      let finished = true;

      for (let i = 0; i < this.options.leds; ++i) {
        newLight.push({ red: 0, green: 0, blue: 0, white: 0 });

        /*  eslint-disable */
        Object.keys(this.currentLight[i]).forEach(color => {
          if (this.currentLight[i][color] > light[i][color]) {
            newLight[i][color] = this.currentLight[i][color] - 1;
          } else if (this.currentLight[i][color] < light[i][color]) {
            newLight[i][color] = this.currentLight[i][color] + 1;
          } else {
            newLight[i][color] = this.currentLight[i][color];
          }

          if (newLight[i][color] !== light[i][color]) {
            finished = false;
          }
        });
        /*  eslint-enable */
      }

      this.setLight(newLight);

      if (finished) {
        this.stopFade();

        return true;
      }
    }, intervalTime);
  }

  stopFade () {
    clearInterval(this.interval);

    return true;
  }

  updateState () {
    let state = this.state;

    if (JSON.stringify(this.currentLight) === JSON.stringify(this.generateDefaultLight(0, 0, 0, 0))) {
      state = 'off';
    } else {
      state = 'on';
    }

    return state;
  }

  storePreviousLight () {
    this.previousLight = this.currentLight;

    return this.previousLight;
  }

  setLight (light) {
    try {
      const image = matrixIo.malos.v1.io.EverloopImage.create();

      // save the new light in currentLight
      this.currentLight = light;

      for (let i = 0; i < this.options.leds; ++i) {
        const ledValue = matrixIo.malos.v1.io.LedValue.create({
          red: Math.max(0, light[i].red),
          green: Math.max(0, light[i].green),
          blue: Math.max(0, light[i].blue),
          white: Math.max(0, light[i].white)
        });

        image.led.push(ledValue);
      }

      const driverConfig = matrixIo.malos.v1.driver.DriverConfig.create({ image });

      this.state = this.updateState();
      this.configSocket.send(matrixIo.malos.v1.driver.DriverConfig.encode(driverConfig).finish());
    } catch (ex) {
      this.emit('error', `${this.options.name} | setLight(): Failed to set light on everloop - ${ex.message}`);
    }

    return true;
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
