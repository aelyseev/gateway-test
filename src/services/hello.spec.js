const test = require('ava');
const agent = require('supertest-koa-agent');
const helloService = require('./hello');
const { hello } = require('../config').services;

const app = agent(helloService);

test('should respond 404 for unhandled requests', async t => {
  const res = await app.get('/');
  t.is(res.status, 404);
});

test(`should respond 200 and valid message for /${hello.endpoint} url`, async t => {
  const res = await app.get(`/${hello.endpoint}`);
  t.is(res.status, 200);
  t.is(res.body.message, 'hello world');
});
