# Pressure Module

The Pressure module is connected the the pressure sensor of the Matrix Creator.

```javascript
const Creator = require('matrix-creator-node-framework');

const pressure = new Creator.Pressure();
```



## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const pressure = new Creator.Pressure({
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
   buntstift.info(JSON.stringify(data));
});
```
