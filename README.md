# Neo (Matrix Creator Framework)

Neo is a framework that makes it easy to set up your own Matrix Creator project using Node.js.

**You can use this framework to ...**

- access the GPIO Pins (Setup and Read Input and Output Pins)
- control the Everloop (Fade and Switch LEDs by using a Light Array)
- read and configure the Humidity, IMU, Uv and Pressure sensors
- TODO: access the Microphone Array (Already coded for an earlier software but still needs to be implemented into this framework)

**To use this Framework you need ...**
- a Matrix Creator Board
- a Raspberry PI where Node.js is installed.
- to install the [Matrix Core Software](https://matrix-io.github.io/matrix-documentation/matrix-core/) (you can find a documentation on how to do this [here](https://matrix-io.github.io/matrix-documentation/matrix-core/getting-started/installation/)).

## Installation

This framework is using [ZMQ](https://www.npmjs.com/package/zmq), make sure you follow the instructions on how to install ZMQ on your computer.

Install via npm directly from GitHub

```
npm install git+https://github.com/mathiskeller/neo-matrix-creator-framework
```

### Setting up a config file

To create the config file `.neoconfig.json` where all the ports and the IP of the Matrix Creator are stored use following command:

```
npx neo create-config
```

This will guide you to the process of creating the config file and saves it to your project folder.

You're now ready to start coding your own project.

## Quickstart

To use this package require it at the top of your project file.

```Javascript
const neo = require('neo-matrix-creator-framework');
```

All single modules you want use need to be initialized:

```javascript
const everloop = new neo.Everloop();
const gpio = new neo.Gpio();
```

Optionally you can define custom options. For example the pingInterval:

```javascript
const gpio = new neo.Gpio({
    pingInterval: 1000
});
```

You can detail information about the available options for each module in the [docs](./docs/) folder:

- [Everloop](./docs/Everloop.md)
- [Gpio](./docs/Gpio.md)
- [Humidity](./docs/Humidity.md)
- [Imu](./docs/Imu.md)
- [Pressure](./docs/Pressure.md)
- [Uv](./docs/Uv.md)


#### Using the single modules

Every module (except the everloop module) comes with an integrated event emitter. To use a module you need to subscribe to the events.

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



## Multiple config-files on different devices

You might want to run the software on your computer and the Raspberry PI. But every time you want to run the software on the Raspberry Pi you have to change the IP. By using two different `.neoconfig.json` files for the Raspberry PI and your computer you don't have to change your code when deploying. The config on the Raspberry PI can hold the local IP (`127.0.0.1`) and the config file on your computer stores the IP of the Raspberry PI.

You can do this by running the `npx neo create-config` command on both systems and adding the `.neoconfig.json` to the gitignore.

## Deployment Process

For me the most easy way to deploy my project onto the Raspberry PI is to use GIT. After cloning my project repository to the raspberry PI, I'm able to pull the current version of the software by just using `git pull`. Because of the two different config files on the devices I didn't need to make any customizations after pulling the software.

## License

The MIT License (MIT) Copyright (c) 2018 Mathis Keller.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
