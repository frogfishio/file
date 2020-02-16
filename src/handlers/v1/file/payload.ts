import { Engine } from '@frogfish/engine';

let logger;

export default class RoleHandler {
  private api;

  constructor(engine: Engine, user) {
    logger = engine.log.log('service:file');
    this.api = engine.files;
  }

  // async get(req, res, next) {
  //   try {
  //     return res.json(await this._engine.role.get(req.path.split('/')[3]));
  //   } catch (err) {
  //     err.send(res);
  //   }
  // }

  // async delete(req, res, next) {
  //   try {
  //     return res.json(await this._engine.role.remove(req.path.split('/')[3]));
  //   } catch (err) {
  //     err.send(res);
  //   }
  // }
}
