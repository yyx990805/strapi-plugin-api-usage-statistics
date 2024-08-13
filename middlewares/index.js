"use strict";

// const pluginName = require('../admin/src/pluginId')

async function update(controller, ctx, strapi) {
  const currentDate = new Date().toISOString().split('T')[0]

  let additional = {};
  if (ctx.query?.filters?.id?.['$eq'] !== undefined) {
    additional = {
      resId: parseInt(ctx.query.filters.id['$eq']),
    };
  }
  // debugger
  const authorizationHeader = ctx.request.header.authorization;
  if (1 && authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.split(' ')[1];
    // ctx.response.set('X-Token-ID', token);
    // additional['tokenId'] = token
    // debugger
    // const s = require('@strapi')

    const getService = () => strapi.service('admin::api-token')
    // const d = require('@strapi/admin')
    /** @typedef {import('@strapi/admin/server/services/api-token')} Api */
    const serv = /** @type {Api} */ getService()
    if(0) {
    require('/home/art/oz-openzacheta/zacheta/strapi/node_modules/.pnpm/@strapi+admin@4.5.2_patch_hash=zapne4ki5wl36hcylcnovdloyy_@strapi+strapi@4.5.2_@types+node@17_3kggsftlnomm7y6ujkneecdfpm/node_modules/@strapi/admin/server/services/api-token.js')
    const r = require('@strapi/admin/server/services/api-token')
    }
    const allTokens = await serv.list()
    // TODO ctx.state.auth
    const tokenHash = serv.hash(token)
    const tokenEntry = await serv.getBy({
      accessKey: tokenHash,
      access_key: tokenHash,
    })
    // const tokenEntry = await strapi.query('api::api-token.api-token').findOne({
    //   where: { token: token },
    // })
    if (ctx.state?.auth?.credentials?.id !== undefined) {
      Object.assign(additional, {
        // tokenId: tokenEntry.id.toString(),
        tokenId: ctx.state.auth.credentials.id,
      })
    }
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

  const existingLogEntry = await strapi.query('api::stat.stat').findOne({
    where: {
      day: currentDate,
      resource: controller,
      ...additional,
    }
  });

  if (existingLogEntry) {
    // TODO prevent race condition and call UPDATE SET counter=counter+1 WHERE id=:id
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

/**
* @param {*} options
* @param {{ strapi: import('@strapi/strapi').Strapi }}
*/
const gatherStats = (options, { strapi }) => {

  return async (/** @type {ReturnType<import('@strapi/strapi').Application.createContext>} */ctx, next) => {
    if (ctx.req.url.startsWith('/api')) {
      /** @type { import('@strapi/strapi').Strapi } */
      const strapi2 = strapi
      await next();
      // let controller = ctx.state?.route?.controller || 'unknown';
      let controller = ctx.state.route.handler || '';
      // const route = strapi.server.router.stack.find(e => e.path.includes(ctx.req.url))
      // strapi.server.router.stack[0].path

      if (typeof controller === 'string') {
        if (controller == 'analytics.logRequest') {
          await next();
          return
        }
        ctx.res.setHeader('tracked-resource-entity-type', `${controller.replace(/:/g, '_')}`);
        await update(controller, ctx, strapi)
      }
      // await next(); // quiz (whats wrong with executing it here? it executes this middleware before request is handled)
    } else {
      await next();
    }
  }
}

module.exports = {
  gatherStats,
  update,
}
