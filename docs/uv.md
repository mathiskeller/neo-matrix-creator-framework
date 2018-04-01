# Uv Module

The Uv module is connected the the uv sensor of the Matrix Creator.

```javascript
const Creator = require('matrix-creator-node-framework');

const uv = new Creator.Uv();
```



## Options

The default options can be found in the constructor of the module and can be customized by using the options object when initializing the module.

```javascript
const uv = new Creator.Uv({
  name: 'UV',
  ip: '127.0.0.1',
  port: 20029,
  delayBetweenUpdates: 2.0,
  timeoutAfterLastPing: 6.0,
  pingInterval: 2000
});
```



## EventListener

To listen to the events emitted by the module use following sample code:

```javascript
uv.on('data', data => {
   buntstift.info(JSON.stringify(data));
});
```
