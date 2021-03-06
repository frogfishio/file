import { Engine } from '@frogfish/kona';

let logger;

export default class RolesHandler {
  constructor(private _engine: Engine, user) {
    logger = _engine.log.log('service:files');
  }

  async get(req, res, next) {
    try {
      return res.json(await this._engine.files.find(req.query, req.path.split('/')[3], req.path.split('/')[4]));
    } catch (err) {
      require('@frogfish/kona/util').error(err, res, logger, 'svc_files_get');
    }
  }
}
