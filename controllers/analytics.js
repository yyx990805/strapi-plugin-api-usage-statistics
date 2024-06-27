const { update } = require("../middlewares")

module.exports = {
  async logRequest(ctx, ...args) {
    // debugger;
    const query = ctx.request.query
    try {
      update(query['controller'], ctx, strapi)
      ctx.set('Content-Type', 'text/plain');
      ctx.send('ok');
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}
