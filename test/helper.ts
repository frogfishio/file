import { Engine } from '@frogfish/kona';
let engine: Engine;

module.exports.engine = async (): Promise<Engine> => {
  return new Promise((resolve, reject) => {
    let engine = global['engine'];

    if (engine) {
      return resolve(engine);
    } else {
      engine = new Engine(`${process.env.ENGINE_ROOT}/test/service.yaml`, {
        root: process.env.ENGINE_ROOT
        // env: 'test_env',
        // tenant: 'test_tenant',
        // app: 'test_name',
        // tag: 'test-tag',
        // live: true
      });

      engine.init().then(() => {
        global['engine'] = engine;
        return resolve(engine);
      });
    }
  });
};
