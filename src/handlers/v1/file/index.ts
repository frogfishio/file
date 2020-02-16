import { Engine } from '@frogfish/engine';
import { ApplicationError } from '@frogfish/engine/error';

let logger;

export default class FileHandler {
  private api;

  constructor(engine: Engine, user) {
    logger = engine.log.log('service:file');
    this.api = engine.files;
  }

  async get(req, res, next) {
    try {
      console.log('PATH = ' + req.path + ' -> ' + req.path.split('/')[3]);
      return res.json(await this.api.get(req.path.split('/')[3]));
    } catch (err) {
      err.send(res);
    }
  }

  // async delete(req, res, next) {
  //   try {
  //     return res.json(await this._engine.role.remove(req.path.split('/')[3]));
  //   } catch (err) {
  //     err.send(res);
  //   }
  // }

  async post(req, res, next) {
    logger.debug('Processing file upload');

    const Busboy = require('busboy');
    const busboy = new Busboy({ headers: req.headers });

    let files = [];
    let fileCounter = 0;
    // let done = false;
    let params: any = {
      mime: req.query.mime,
      name: req.query.name,
      type: req.query.type
    };

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
      logger.debug(`Got field ${fieldname}=${val}`);
      if (!params[fieldname] && (fieldname === 'tags' || fieldname === 'meta')) {
        params[fieldname] = val;
      }
    });

    busboy.on('file', async (fieldname, stream, filename, encoding, mimetype) => {
      logger.debug('found file: ' + filename);
      fileCounter++;

      try {
        const result = await this.api.create(filename, stream);
        console.log('File saved: ' + JSON.stringify(result, null, 2));
        fileCounter--;
        files.push(result);

        if (fileCounter === 0) {
          return res.json(files);
        }
      } catch (err) {
        console.error(err);
        return err.send
          ? err.send(res)
          : res.status(500).json({
              error: 'system_error',
              error_description: 'System error uploading file',
              trace: 'svc_file_create2'
            });
      }
    });

    req.pipe(busboy);
  }
}
