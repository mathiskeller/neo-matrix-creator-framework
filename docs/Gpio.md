# GPIO Module

The GPIO module is connected the the GPIO of the Matrix Creator.

```javascript
const neo = require('neo-matrix-creator-framework');

const gpio = new neo.Gpio();
```

## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const gpio = new neo.Gpio({
  name: 'GPIO',
  ip: '127.0.0.1',
  port: 20049,
  delayBetweenUpdates: 0.250,
  timeoutAfterLastPing: 2.0,
  pingInterval: 2000
});
```

## Parameters

```javascript
gpio.Pins // stores all the registered pin objects and their value
```

A pin object stores all the information about the pin:

```javascript
{
  index: 0, // the pins index
  mode: gpioParams.mode, // INPUT or OUTPUT
  type: 'button', // customizeable type, for example 'button' or 'led'
  name: 'button_name', // the name of this pin
  value: 0 // it's value (not updated automatically)
}
```

## Methods

```javascript
gpio.button({ pin, name }) // registers a new button (index = pin number)
gpio.setOutputPin({ pin, type, name, value }) // updates/creates an output pin
gpio.setInputPin({ pin, type, name }) // Registers a new input pin
```

#### setInputPin()

When registering an input pin it's value is emitted by the basic event emitter of the module. It emits

- the pin object
- it's value

```javascript
gpio.setInputPin({
  pin: 1,
  type: 'touch-sensor',
  name: 'touch'
});

gpio.on('touch', data => {
  console.log(`${data.pin}: ${data.value}`);
})
```

#### setOutputPin()

Everytime you want to change an output pin you have to set it's value.

```javascript
// Switch to value 0
gpio.setOutputPin({
  pin: 3,
  type: 'LED',
  name: 'pin',
  value: 0
});
```


#### button()

After the register of a button you can use it's event emitter to listen to it's event which emits the buttons state ("pressed" or "released")

```javascript
gpio.button(0, 'switch');

gpio.on('switch', state => {
  if (state === 'pressed') {
    console.log('button pressed');
  } else {
    console.log('button released');
  }
}
```



#### Customization

You can use the `button()` method as a blueprint to create your own custom Input/Output pins.

```Javascript
  button ({ pin, name }) {
    this.setInputPin({
      pin,
      type: 'button',
      name
    });

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
```
