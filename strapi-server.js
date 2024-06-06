const middlewares = require('./middlewares');
const controllers = require('./controllers/index');
const routes = require('./routes/index');

module.exports = () => ({
  register(/** @typeof ({ strapi: import('@strapi/strapi').Strapi }) */{ strapi }) {
    if(0) strapi.server.routes([
      {
        method: 'GET',
        path: '/stats.csv',
        handler: 'csv.getCsv',
        config: {
          policies: [],
          auth: false,
        },
      },
    ]);
  },
  async bootstrap({ strapi }) {
    // strapi.server.use(middlewares.gatherStats); // FIXME, order is wrong (middleware is pushed to the list of middlewares (via plugins) too late)
    // jsonInteractiveResponseMiddleware({ strapi });
  },
  middlewares,
  routes,
  controllers,
});
