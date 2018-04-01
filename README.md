# Matrix Creator Node Framework

Matrix Creator Node Framework makes it easy to set up your own Matrix Creator project using Node.js.



**The Framework includes modules to ...**

- access the GPIO Pins (Setup and Read Input and Output Pins)
- control the Everloop (Fade and Switch LEDs by using a Light Array)
- read and configure the Humidity, IMU, Uv and Pressure sensors
- access the Microphone Array




**Requirements**

To use this Framework you need ...

- to install the [Matrix Core Software](https://matrix-io.github.io/matrix-documentation/matrix-core/) (you can find a documentation on how to do this [here](https://matrix-io.github.io/matrix-documentation/matrix-core/getting-started/installation/)).
- a Raspberry PI where Node.js is installed.




## Installation

Install via npm directly from GitHub
```
npm install git+https://github.com/mathiskeller/matrix-creator-node-framework
```

Clone from GitHub
```
git clone https://github.com/mathiskeller/matrix-creator-node-framework
```



Open the Terminal, navigate to your project folder and run npm install
```
cd <PROJECT_FOLDER>
npm install
```

You're now ready to start coding your own project.



## Quickstart

Use the index.js file as the entry point of your software. Here you can integrate the modules you want to use in your project and write your code.

To integrate the modules write:

```Javascript
const Everloop = require('./modules/creator/everloop');
const Gpio = require('./modules/creator/gpio');
...
```

All modules you use need to be initialized.

```javascript
const everloop = new Everloop();
const gpio = new Gpio();
...
```

Optionally you can define custom options. For example the IP address if you want to access the matrix creator from another device.

```
const gpio = new Gpio({
    ip: '<MATRIX_CREATOR_IP>'
});
```

The complete list of options can be found in the specific modules readme file.



#### Using the modules

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

You can find a List on how to subscribe to the single modules [here](./modules/creator/Modules.md)



### Using the config file

You can customize the configuration by renaiming `config.tpl.js` to `config.js` and integrate it to your **index.js** with following command.

```javascript
const Config = require('./config');
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

You can also add aditional configuration like the connection to your Hue Lights or other APIs inside here.

```javascript
CONFIG.Hue = {
  Id: '<HUE_BRIDGE_ID>',
  Host: '<HUE_IP_ADDRESS>',
  User: '<HUE_USER>'
};
```



#### **Multiple config-files on different devices**

You might want to run the software on your computer and the Raspberry PI. But every time you want to run the software on the Raspberry Pi you have to change the IP. By using two different `config.js` files for the Raspberry PI and your computer you don't have to change your code when deploying. The config.js file on the Raspberry PI can hold the local IP (`127.0.0.1`) and the `config.js` file on your computer stores the IP of the Raspberry PI.



### Deployment Process

For me the most easy way to depoly the project onto the Raspberry PI is to use GIT. After cloning my project repository to the raspberry PI, I'm able able to pull the current version of the software by just using `git pull`. Because of the two different config files on the devices I didn't need to make any customizations after pulling the software.
