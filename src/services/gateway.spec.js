/* eslint-disable no-param-reassign */
const test = require('ava');
const Koa = require('koa');
const Router = require('koa-router');
const http = require('http');
const agent = require('supertest-koa-agent');
const listen = require('test-listen');
const createAccessToken = require('../create-access-token');

const createGateway = require('./gateway');

const { services: { greeting, hello }, gateway } = require('../config');

test.before(async t => {
  const helloApp = new Koa();
  const helloRouter = new Router();
  helloRouter.get(`/${hello.endpoint}`, async ctx => {
    ctx.body = { message: 'hello' }
  });
  helloApp.use(helloRouter.allowedMethods());
  helloApp.use(helloRouter.routes());
  t.context.hello = http.createServer(helloApp.callback());
  const publicHost = await listen(t.context.hello);

  const greetingApp = new Koa();
  const greetingRouter = new Router();
  greetingRouter.get(`/${greeting.endpoint}`, async ctx => {
    ctx.body = { message: 'greeting' }
  });
  greetingApp.use(greetingRouter.allowedMethods());
  greetingApp.use(greetingRouter.routes());
  t.context.greeting = http.createServer(greetingApp.callback());
  const authorisedHost = await listen(t.context.greeting);

  t.context.app = agent(createGateway(`${publicHost}/${hello.endpoint}`, `${authorisedHost}/${greeting.endpoint}`));
});

test.after.always(t => {
  t.context.hello.close();
  t.context.greeting.close();
});

test(`should create access token for proper request on /${gateway.auth}`, async t => {
  const res = await t.context.app.post(`/${gateway.auth}`).send({ name: 'John' });
  t.is(res.status, 200);
  t.truthy(res.body.accessToken);
});

test(`should respond 400 for malformed request on /${gateway.auth}`, async t => {
  const res = await t.context.app.post(`/${gateway.auth}`).send({ lastname: 'John' });
  t.is(res.status, 400);
});

test('should respond to unauthorized requests', async t => {
  const res = await t.context.app.get(`/${gateway.endpoint}`);
  t.is(res.status, 200);
  t.is(res.body.message, 'hello');
});

test('should respond to authorized requests', async t => {
  const res = await t.context.app.get('/hello').set('Authorization', `Bearer ${createAccessToken({ name: 'token' })}`);
  t.is(res.status, 200);
  t.is(res.body.message, 'greeting');
});

test('should respond 401 for expired access token', async t => {
  const token = createAccessToken({ name: 'token' }, '1ms');
  const res = await t.context.app.get('/hello').set('Authorization', `Bearer ${token}`);
  t.is(res.status, 401);
});

