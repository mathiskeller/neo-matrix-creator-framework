'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const neo = require(path.join('..', '..', 'src', 'matrix'));

const tempDirectory = path.join(__dirname, 'temp');

suite('matrix', function () {
  this.timeout(90 * 1000);

  setup(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  teardown(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  suite('everloop', () => {
    test('creates new instance with custom options', async () => {
      const everloop = new neo.Everloop({
        name: 'Everloop Instance',
        ip: 'CustomIP'
      });

      assert.that(everloop.options.name).is.equalTo('Everloop Instance');
      assert.that(everloop.options.ip).is.equalTo('CustomIP');
    });

    test('Switches the Everloop off', async () => {
      const everloop = new neo.Everloop();

      const off = everloop.off();
      const currentLight = everloop.currentLight;

      assert.that(off).is.equalTo(true);
      assert.that(currentLight).is.equalTo(everloop.generateDefaultLight(0, 0, 0, 0));
    });

    test('TurnOnWhiteLight', async () => {
      const everloop = new neo.Everloop();

      everloop.setLight(everloop.generateDefaultLight(0, 0, 0, 100));

      const currentLight = everloop.currentLight;

      assert.that(currentLight).is.equalTo(everloop.generateDefaultLight(0, 0, 0, 100));
    });

    test('Generates Light with wrong parameters', async () => {
      const everloop = new neo.Everloop();

      everloop.on('error', err => {
        assert.that(err).is.containing('Green needs to be between 0 and 100');
      });

      everloop.generateDefaultLight(0, 300, 0, 0);
    });
  });
});
