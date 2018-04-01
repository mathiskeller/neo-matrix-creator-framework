'use strict';

const CONFIG = {};

CONFIG.Creator = {
  Ip: '<MATRIX_CREATOR_IP>',
  Ports: {
    Mic: 20037,
    Everloop: 20021,
    Humidity: 20017,
    Pressure: 20025,
    Uv: 20029,
    Imu: 20013,
    Gpio: 20049,
    Lirc: 20041
  }
};

// You can add aditional config objects here ...

module.exports = CONFIG;
