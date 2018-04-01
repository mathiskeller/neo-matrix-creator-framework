# Humidity Module

The Humidity module is connected the the humidity sensor of the Matrix Creator.

```javascript
const Creator = require('matrix-creator-node-framework');

const humidity = new Creator.Humidity();
```



## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const humidity = new Creator.Humidity({
  name: 'HUMIDITY',
  ip: '127.0.0.1',
  port: 20017,
  delayBetweenUpdates: 2.0,
  timeoutAfterLastPing: 6.0,
  calibrationTemperature: 23,
  pingInterval: 2000
});
```



## EventListener

To listen to the events emitted by the module use following sample code:

```javascript
humidity.on('data', data => {
   buntstift.info(JSON.stringify(data));
});
```
