"use strict";

// const pluginName = require('../admin/src/pluginId')

/**
* @param {*} options
* @param {{ strapi: import('@strapi/strapi').Strapi }}
*/
const gatherStats = (options, { strapi }) => {
  return async (/** @type {ReturnType<import('@strapi/strapi').Application.createContext>} */ctx, next) => {
    if (ctx.req.url.includes('api')) {
      /** @type { import('@strapi/strapi').Strapi } */
      const strapi2 = strapi
      await next();
      // let controller = ctx.state?.route?.controller || 'unknown';
      let controller = ctx.state.route.handler || '';
      // const route = strapi.server.router.stack.find(e => e.path.includes(ctx.req.url))
      // strapi.server.router.stack[0].path

      let additional = 0;
      if (ctx.query?.filters?.id?.['$eq'] !== undefined) {
        additional = {
          resId: parseInt(ctx.query.filters.id['$eq']),
        };
      }
      /*
      if (0) {
        if (ctx.query?.filters?.id?.['$lt'] !== undefined) {
          if (ctx.query.pagination.pageSize == '1') {
            additional = {
              resId: parseInt(ctx.query.filters.id['$lt']),
            };
          } else {
            console.warn('only pageSize=1')
          }
        }
      }
      */

      if (typeof controller === 'string') {
        const currentDate = new Date().toISOString().split('T')[0]
        ctx.res.setHeader('tracked-resource-entity-type', `${controller.replace(/:/g, '_')}`);
        const existingLogEntry = await strapi.query('api::stat.stat').findOne({
          where: {
            day: currentDate,
            resource: controller,
            ...additional,
          }
        });

        if (existingLogEntry) {
          await strapi.query('api::stat.stat').update({
            where: { id: existingLogEntry.id },
            data: {
              counter: existingLogEntry.counter + 1
            },
          });
        } else {
          try {
            await strapi.query('api::stat.stat').create({
              data: {
                resource: controller,
                day: currentDate,
                ...additional,
                counter: 1,
              },
            });
          } catch (error) {
            strapi.log.error('Failed to save log entry:', error);
          }
        }
      }
      // await next(); // quiz (whats wrong with executing it here? it executes this middleware before request is handled)
    } else {
      await next();
    }
  }
}

module.exports = {
  gatherStats,
}
