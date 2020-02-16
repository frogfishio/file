const debug = require('debug')('request');
const request = require('request');

module.exports.post = async function(url: string, data: any, token?: string): Promise<any> {
  return req('POST', url, data, token, true);
};

module.exports.put = async function(url: string, data: any, token?: string): Promise<any> {
  return req('PUT', url, data, token, true);
};

module.exports.patch = async function(url: string, data: any, token?: string): Promise<any> {
  return req('PATCH', url, data, token, true);
};

module.exports.get = async function(url: string, query: any, token?: string): Promise<any> {
  return req('GET', url, query, token, true);
};

module.exports.del = async function(url: string, query: any, token?: string): Promise<any> {
  return req('DELETE', url, query, token, true);
};

async function req(method: string, url: string, data?: any, token?: string, raw?: boolean): Promise<any> {
  method = method.toUpperCase();

  const rq: any = {
    method: method,
    uri: url,
    json: true
  };

  if (data) {
    if (method === 'GET' || method === 'DELETE') {
      rq.qs = data;
    } else {
      if (raw) {
        rq.body = data;
      } else {
        rq.form = data;
      }
    }
  }

  if (token) {
    rq.headers = { Authorization: `Bearer ${token}` };
  }

  return new Promise((resolve, reject) => {
    debug(`Requesting: ${JSON.stringify(rq)}`);
    request(rq, (err, response, body) => {
      if (err) {
        console.error(err);
        console.error(body);
        console.error(response);
        return reject(err);
      }
      if (response.statusCode !== 200) {
        return reject(body);
      }
      if (response.statusCode === 200) {
        debug(`Request returned ${JSON.stringify(body)}`);
        return resolve(body);
      }
    });
  });
}
