module.exports = function test(middleware, condition) {
  return async (ctx, next) => {
    if (condition(ctx)) {
      await middleware(ctx, next)
    } else {
      await next()
    }
  }
};
