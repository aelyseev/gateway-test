const Koa = require('koa');
const Router = require('koa-router');

const { services: { greeting } } = require('../config');

const app = new Koa();
const router = new Router();

router.get(`/${greeting.endpoint}`, async ctx => {
  try {
    const { name } = JSON.parse(ctx.request.header.user);
    if (name) {
      ctx.body = { message: `hello ${name}` };
    } else {
      throw Error();
    }
  } catch (e) {
    ctx.status = 400;
    ctx.body = 'Bad request';
  }
});

app.use(router.allowedMethods());
app.use(router.routes());

module.exports = app;

