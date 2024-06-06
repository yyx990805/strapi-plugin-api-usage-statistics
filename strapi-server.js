const middlewares = require('./middlewares');
const controllers = require('./controllers/index');
const routes = require('./routes/index');

module.exports = () => ({
  async bootstrap({ strapi }) {
    strapi.server.use(middlewares.gatherStats);
    // jsonInteractiveResponseMiddleware({ strapi });
  },
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
  middlewares,
  routes,
  controllers,
});
