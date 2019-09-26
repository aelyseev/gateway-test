const test = require('ava');
const agent = require('supertest-koa-agent');
const greetingService = require('./greeting');
const { greeting } = require('../config').services;

const app = agent(greetingService);

test('should respond 404 for unhandled requests', async t => {
  const res = await app.get('/');
  t.is(res.status, 404);
});

test(`should respond 200 and correct message for valid header for /${greeting.endpoint} url`, async t => {
  const res = await app.get(`/${greeting.endpoint}`).set('user', JSON.stringify({ name: 'Winston' }));
  t.is(res.status, 200);
  t.is(res.body.message, 'hello Winston');
});

test('should respond 400 for malformed header', async t => {
  const res = await app.get(`/${greeting.endpoint}`).set('user', JSON.stringify({ lastname: 'Winston' }));
  t.is(res.status, 400);
});
