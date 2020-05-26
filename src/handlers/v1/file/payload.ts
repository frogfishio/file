import { Engine } from '@frogfish/kona';

let logger;

export default class FilePayloadHandler {
  private api;

  constructor(engine: Engine, user) {
    logger = engine.log.log('service:file:payload');
    this.api = engine.files;
  }

  async get(req, res, next) {
    const id = req.path.split('/')[3];
    try {
      const file = await this.api.get(id);

      logger.debug(`Sending payload for ${file.name} with mime ${file.mime}`);

      res.set('Content-Type', file.mime);
      this.api.payload(id).then((stream) => stream.pipe(res));
    } catch (err) {
      require('@frogfish/kona/util').error(err, res, logger, 'svc_file_payload_get');
    }
  }
}
