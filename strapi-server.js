const middlewares = require('./middlewares');

module.exports = {
  async bootstrap({ strapi }) {
    // jsonInteractiveResponseMiddleware({ strapi });
  },
  middlewares,
};
