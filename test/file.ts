import { Engine } from '@frogfish/kona';

const fs = require('fs');
const chai = require('chai');
chai.use(require('chai-like'));
chai.use(require('chai-things'));

const expect = chai.expect;
const request = require('./request');

const API = 'http://localhost:8000/v1';
const TIME = Date.now();

let engine: Engine;
let adminToken;
let testFile;

describe('File', () => {
  beforeEach(async () => {
    engine = await require('./helper').engine();
    adminToken =
      adminToken ||
      (
        await engine.auth.authenticate({
          grant_type: 'password',
          email: 'test@test.test',
          password: 'testtest',
        })
      ).access_token;
  });

  it('should uppload test image', (done) => {
    const fs = require('fs');
    const rq = require('request');

    rq.post(
      `${API}/file`,
      {
        headers: { Authorization: 'Bearer ' + adminToken },
        formData: { file: fs.createReadStream(`${process.env.ENGINE_ROOT}/test/test.jpg`) },
        json: true,
      },
      (err, httpResponse, body) => {
        // console.log(`GOT: ${JSON.stringify(body, null, 2)}`);
        expect(httpResponse).to.have.property('statusCode').which.equals(200);
        expect(body).to.be.instanceof(Array).with.length(1);

        testFile = body[0];
        done();
      }
    );
  });

  it('should get file by ID', async () => {
    const res = await request.get(`${API}/file/${testFile.id}`, {}, adminToken);
    console.log('GOT ---> ' + JSON.stringify(res, null, 2));
    expect(res).to.have.property('_uuid').which.equals(testFile.id);
  });

  it('should find file using ID as filter', async () => {
    const res = await request.get(`${API}/files`, { _uuid: testFile.id }, adminToken);
    console.log('FOUND ---> ' + JSON.stringify(res));
    expect(res).to.be.instanceof(Array).with.length(1);
  });

  // TODO: implement me properly
  // it('should get file payload', (done) => {
  //   const fs = require('fs');
  //   const ag = require('superagent');

  //   ag.get(`${API}/file/${testFile.id}/payload`)
  //     .set('Authorization', 'Bearer ' + adminToken)
  //     .end((err, res) => {
  //       let crypto = require('crypto');
  //       let shasum = crypto.createHash('sha1');
  //       shasum.update(res.body);

  //       const digest = shasum.digest('hex');
  //       console.log('SHA ------> ' + digest);

  //       expect(digest).to.equals(testFile.digest);
  //       done();
  //     });
  // });

  it('should delete file', async () => {
    await request.del(`${API}/file/${testFile.id}`, {}, adminToken);
  });

  it('should NOT find file using ID as filter', async () => {
    expect(await request.get(`${API}/files`, { _uuid: testFile.id }, adminToken))
      .to.be.instanceof(Array)
      .with.length(0);
  });

  it('should FAIL getting file by ID', async () => {
    try {
      await request.get(`${API}/file/${testFile.id}`, {}, adminToken);
      return Promise.reject('Was expecting the file to be deleted');
    } catch (er) {}
  });
});
