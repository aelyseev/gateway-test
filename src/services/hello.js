const Koa = require('koa');
const Router = require('koa-router');

const { hello } = require('../config').services;

const app = new Koa();
const router = new Router();
router.get(`/${hello.endpoint}`, async ctx => {
  ctx.status = 200;
  ctx.body = { message: 'hello world' };
});

app.use(router.allowedMethods());
app.use(router.routes());

module.exports = app;
