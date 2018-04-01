# Matrix Creator Node Framework

Matrix Creator Node Framework makes it easy to set up your own Matrix Creator project using Node.js.



**You can use this framework to ...**

- access the GPIO Pins (Setup and Read Input and Output Pins)
- control the Everloop (Fade and Switch LEDs by using a Light Array)
- read and configure the Humidity, IMU, Uv and Pressure sensors
- TODO: access the Microphone Array




**To use this Framework you need ...**
- a Matrix Creator Board
- a Raspberry PI where Node.js is installed.
- to install the [Matrix Core Software](https://matrix-io.github.io/matrix-documentation/matrix-core/) (you can find a documentation on how to do this [here](https://matrix-io.github.io/matrix-documentation/matrix-core/getting-started/installation/)).




## Installation

This framework is using [ZMQ](https://www.npmjs.com/package/zmq), make sure you follow the instructions on how to install ZMQ on your computer.

Install via npm directly from GitHub

```
npm install git+https://github.com/mathiskeller/matrix-creator-node-framework
```

You're now ready to start coding your own project.



## Quickstart

To use this package require it at the top of your project file.

```Javascript
const Creator = require('matrix-creator-node-framework');
...
```

All modules you want use need to be initialized:

```javascript
const everloop = new Creator.Everloop();
const gpio = new Creator.Gpio();
...
```

Optionally you can define custom options. For example the IP address if you want to access the matrix creator from another device:

```
const gpio = new Creator.Gpio({
    ip: '<MATRIX_CREATOR_IP>'
});
```

You can detail information about the available options for each module in the [docs](./docs/)



#### Using the single modules

Every module (except the everloop module) comes with an integrated event emitter. To use a module you need to substribe to the events.

The following example shows how to use the GPIO module to toggle the Everloop LEDs. First you need to define an button. Afterwards you can listen on events emitted by this button. To toggle the Everloop every time you click the button you need to get the state of the LEDs.

```javascript
// Define pin0 as a button with the name 'light-switch'
gpio.button(0, 'light-switch');

// listen to events form light-switch
gpio.on('light-switch', state => {
  if (everloop.state === 'off') {
    // Switch Everloop on
    everloop.fadeLight(everloop.generateGradient([
      { red: 0, green: 0, blue: 50, white: 0 },
      { red: 0, green: 50, blue: 10, white: 0 }
    ]));
  } else {
    // Switch Everloop off
    everloop.fadeLight(everloop.generateDefaultLight(0, 0, 0, 0));
  }
});
```

You can detail information about this in the [docs](./docs/)



## Setting up a config file

You can customize the configuration by copying and renaming `config.tpl.js` to `config.js` and integrate it to your project-file using following code:

```javascript
const Config = require('<PATH-TO-CONFIG-FILE>');

const gpio = new Creator.Gpio({
    ip: Config.Creator.Ip
});
```

Inside the config-file you can set a custom IP and custom ports for your Matrix Creator.

```javascript
CONFIG.Creator = {
  Ip: '<MATRIX_CREATOR_IP>',
  Ports: {
    Mic: 20037,
    ...
  }
};
```

You can also add additional configuration like the connection to your Hue Lights or other APIs inside here.

```javascript
CONFIG.Hue = {
  Id: '<HUE_BRIDGE_ID>',
  Host: '<HUE_IP_ADDRESS>',
  User: '<HUE_USER>'
};
```



#### **Multiple config-files on different devices**

You might want to run the software on your computer and the Raspberry PI. But every time you want to run the software on the Raspberry Pi you have to change the IP. By using two different `config.js` files for the Raspberry PI and your computer you don't have to change your code when deploying. The config.js file on the Raspberry PI can hold the local IP (`127.0.0.1`) and the `config.js` file on your computer stores the IP of the Raspberry PI.



## Deployment Process

For me the most easy way to depoly the project onto the Raspberry PI is to use GIT. After cloning my project repository to the raspberry PI, I'm able able to pull the current version of the software by just using `git pull`. Because of the two different config files on the devices I didn't need to make any customizations after pulling the software.



## License

ISC License Copyright (c) 2018, Mathis Keller

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
