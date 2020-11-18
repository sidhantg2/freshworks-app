'use strict';

const request = require('supertest');

const init = require('../../app.js').init;

describe('hello controller', () => {
  const originalStdoutWrite = process.stdout.write;
  const originalStderrWrite = process.stderr.write;

  const stdout = [];
  const stderr = [];

  let app;

  beforeAll(() => {
    process.stdout.write = function (data) {
      stdout.push(data);
    };

    process.stderr.write = function (data) {
      stderr.push(data);
    };

    return init()
      .then(loaded => app = loaded);
  });

  afterAll(() => {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
  });

  test('GET /v1/hello', () => {
    return request(app)
      .get('/v1/hello')
      .expect(200)
      .then(response => {
        const helloMessage = 'freshworks says hello, stranger!';
        expect(response.body.message).toBe(helloMessage);
      });
  });

  test('GET /v1/hello?name=bozo', () => {
    return request(app)
      .get('/v1/hello?name=bozo')
      .expect(200)
      .then(response => {
        const helloMessage = 'freshworks says hello, bozo!';
        expect(response.body.message).toBe(helloMessage);
      });
  });

  test('GET /v1/hello?error=1', () => {
    return request(app)
      .get('/v1/hello?error=1')
      .expect(500)
      .then(response => {
        expect(response.get('content-type')).toBe('application/json; charset=utf-8');
        expect(response.body.message).toBe('noSuchFunction is not defined');
      });
  });

  test('404 handler', () => {
    return request(app)
      .get('/endpoint-does-not-exist')
      .expect(404)
      .then(response => {
        expect(response.get('content-type')).toBe('application/json; charset=utf-8');
        expect(response.body.error).toBe('The requested endpoint does not exist.');
      });
  });

});
