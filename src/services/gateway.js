const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const proxy = require('koa-proxy');
const jwtMiddleware = require('koa-jwt');

const test = require('./if');

const { authentication, gateway } = require('../config');

const createAccessToken = require('../create-access-token');

module.exports = function createGateway(publicUrl, authorisedUrl) {
  const app = new Koa();
  const router = new Router();

  router.post(`/${gateway.auth}`, bodyParser(), async ctx => {
    if (ctx.request.body.name) {
      ctx.body = { accessToken: createAccessToken({ name: ctx.request.body.name }) };
    } else {
      ctx.status = 400;
      ctx.body = 'Bad request'
    }
  });

  router.get(
    `/${gateway.endpoint}`,
    test(proxy({ url: publicUrl }), ctx => !ctx.request.header.authorization)
  );

  router.get(`/${gateway.endpoint}`, jwtMiddleware({ secret: authentication.secret, passthrough: true }));

  router.get(`/${gateway.endpoint}`, async (ctx, next) => {
    if (ctx.state.jwtOriginalError) {
      ctx.status = 401;
      ctx.body = 'Unauthorised access';
    } else {
      ctx.request.header.user = JSON.stringify(ctx.state.user);
      await next();
    }
  });

  router.get(`/${gateway.endpoint}`, proxy({ url: authorisedUrl }));

  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
};
