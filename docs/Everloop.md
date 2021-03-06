# Everloop Module

The Everloop module is connected the the Everloop of the Matrix Creator.

```javascript
const neo = require('neo-matrix-creator-framework');

const everloop = new neo.Everloop();
```



## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const everloop = new neo.Everloop({
  name: 'EVERLOOP',
  ip: '127.0.0.1',
  port: 20021,
  leds: 35
});
```


## Parameters

```javascript
everloop.currentLight // stores the current light object
everloop.previousLight // stores the previous light object
everloop.state // stores the current state ('on' or 'off')
```


#### Light Array

The light array is an array with 35 (the number of LEDs) rgbw objects. It can be generated by using `generateGradient(colors)` and `generateDefaultLight(red, green, blue, white)`



## Methods

```javascript
everloop.generateGradient(colors) // returns a light gradient by using an array
everloop.generateDefaultLight(red, green, blue, white) // returns a light
everloop.off() // Switches the light off using a fade
everloop.switchLight(light) // switches the LEDs to the defined light
everloop.fadeLight(light, intervalTime) // fades the LEDs to the defined light
```



#### generateGradient()

To generate a light gradient you can paste up to 35 colors as an array to the `generateGradient(colors)` command. See the following example:

```javascript
const redToBlue = everloop.generateGradient([
  { red: 100, green: 0, blue: 0, white: 0 },
  { red: 0, green: 0, blue: 100, white: 0 }
  // ... add up to 33 colors
]);

everloop.fadeLight(redToBlue);
```

## EventListener

To listen to the events emitted by the module use following sample code:

```javascript
// optional
everloop.on('error', err => {
  console.log(err);
});
```
