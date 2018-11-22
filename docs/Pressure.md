# Pressure Module

The Pressure module is connected the the pressure sensor of the Matrix Creator.

```javascript
const neo = require('neo-matrix-creator-framework');

const pressure = new neo.Pressure();
```



## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const pressure = new neo.Pressure({
  name: 'IMU',
  ip: '127.0.0.1',
  port: 20013,
  delayBetweenUpdates: 2.0,
  timeoutAfterLastPing: 6.0,
  pingInterval: 2000
});
```



## EventListener

To listen to the events emitted by the module use following sample code:

```javascript
pressure.on('data', data => {
  console.log(JSON.stringify(data));
});

// optional
pressure.on('error', err => {
  console.log(err);
});
```
