import { Engine } from '@frogfish/engine';

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
          email: 'testadmin@frogfish.com',
          password: 'testpassword'
        })
      ).access_token;
  });

  it('should uppload test image', done => {
    const fs = require('fs');
    const rq = require('request');

    rq.post(
      `${API}/file`,
      {
        headers: { Authorization: 'Bearer ' + adminToken },
        formData: { file: fs.createReadStream(`${process.env.ENGINE_ROOT}/test/test.jpg`) },
        json: true
      },
      (err, httpResponse, body) => {
        // console.log(`GOT: ${JSON.stringify(body, null, 2)}`);
        expect(httpResponse)
          .to.have.property('statusCode')
          .which.equals(200);
        expect(body)
          .to.be.instanceof(Array)
          .with.length(1);

        testFile = body[0];
        done();
      }
    );
  });

  it('should get file', async () => {
    expect(await request.get(`${API}/file/${testFile.id}`, {}, adminToken))
      .to.have.property('_uuid')
      .which.equals(testFile.id);
  });

  it('should get file payload', done => {
    const fs = require('fs');
    const ag = require('superagent');

    ag.get(`${API}/file/${testFile.id}/payload`)
      .set('Authorization', 'Bearer ' + adminToken)
      .end((err, res) => {
        let crypto = require('crypto');
        let shasum = crypto.createHash('sha1');
        shasum.update(res.body);

        const digest = shasum.digest('hex');
        console.log('SHA ------> ' + digest);

        expect(digest).to.equals(testFile.digest);
        done();
      });
  });

  // it('should find brand', async () => {
  //   expect(await request.get(`${API}/brands`, { _uuid: testBrandId }, adminToken))
  //     .to.be.instanceof(Array)
  //     .with.length(1);
  // });

  // it('should update brand', async () => {
  //   expect(await request.patch(`${API}/brand/${testBrandId}`, { status: 'approved' }, adminToken))
  //     .to.have.property('id')
  //     .which.equals(testBrandId);
  // });

  // it('should get updated brand', async () => {
  //   expect(await request.get(`${API}/brand/${testBrandId}`, {}, adminToken))
  //     .to.have.property('status')
  //     .which.equals('approved');
  // });

  // it('should delete brand', async () => {
  //   expect(await request.del(`${API}/brand/${testBrandId}`, {}, adminToken))
  //     .to.have.property('id')
  //     .which.equals(testBrandId);
  // });

  // it('should fail getting deleted brand', async () => {
  //   try {
  //     expect(await request.get(`${API}/brand/${testBrandId}`, {}, adminToken)).to.not.exist();
  //   } catch (err) {
  //     expect(err.error).to.equals('not_found');
  //   }
  // });

  // it('should find deleted brand', async () => {
  //   expect(await request.get(`${API}/brands`, { _uuid: testBrandId }, adminToken))
  //     .to.be.instanceof(Array)
  //     .with.length(0);
  // });
});
