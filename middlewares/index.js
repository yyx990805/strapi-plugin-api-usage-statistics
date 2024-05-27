"use strict";

// const pluginName = require('../admin/src/pluginId')

/**
* @param {*} options
* @param {{ strapi: import('@strapi/strapi').Strapi }}
*/
const gatherStats = (options, { strapi }) => {
  /** @type { import('@strapi/strapi').Strapi } */
  const strapi2 = strapi
  return async (/** @type {ReturnType<import('@strapi/strapi').Application.createContext>} */ctx, next) => {
    ctx.res.setHeader('tracked-resource-entitype-type', 'api::model');
    await next();
  }
}

module.exports = {
  gatherStats,
}
