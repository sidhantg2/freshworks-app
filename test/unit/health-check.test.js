'use strict';

const request = require('supertest');

const init = require('../../app.js').init;

describe('health check', () => {
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

  test('GET /v1/ping', () => {
    return request(app)
      .get('/v1/ping')
      .expect(504)
      .then(response => {
        expect(response.body.pong).toBe(true);
      });
  });
});
