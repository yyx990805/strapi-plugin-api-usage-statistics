'use strict';

// const { parseISO, startOfDay, endOfDay } = require('date-fns');

module.exports = {
  async getCsv(ctx) {
    try {
      // const today = new Date();
      // const start = startOfDay(today);
      // const end = endOfDay(today);
      // const stats = await strapi.query('api::stat.stat').findMany({
      //   where: {
      //     created_at: {
      //       $gte: start,
      //       $lte: end

      let stats;
      if (0) {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        
        stats = await strapi.query('api::stat.stat').findMany({
          where: {
            createdAt: {
              $gte: start.toISOString(),
              $lt: end.toISOString()
            }
          }
        });
      }
      if (1) {
        const reportYear = ctx.req.query || '2024';
        const startDate = `2023-09-09`;
        const endDate = `2024-09-09`;
        `
        SELECT resource,
          strftime('%Y', "day") AS "year",
          strftime('%m', "day") AS "month",
          sum(counter) as "sum_counter"
        FROM statistics
        WHERE "day" > '2023-09-01' AND "day" <= '2024-09-31'
        GROUP BY resource, "year", "month"      
        `;
        stats = await strapi.db.connection.raw(`
          SELECT resource,
            -- EXTRACT(MONTH FROM "day") AS "month", -- postgres
            -- EXTRACT(DAY FROM "day") AS "day", -- postgres
            strftime('%Y', "day") AS "year",
            strftime('%m', "day") AS "month",
            sum(counter) as "sum_counter"
          FROM statistics
          WHERE "day" > '2023-09-01' AND "day" <= '2024-09-31'
          GROUP BY resource, "year", "month"
        `.replace("'2023-09-01'", '?').replace("'2024-09-31'", '?'), [startDate, endDate]);
      }
      if (0) {
        stats = await strapi.db.connection.raw(`
          SELECT
            -- id, name as "api_token_name",
            strftime('%Y', datetime(created_at/1000, 'unixepoch')) AS "year",
            strftime('%m', datetime(created_at/1000, 'unixepoch')) AS "month",
            -- group_concat(datetime(created_at/1000, 'unixepoch')) as "created at",
            count(id) as "number"
          FROM "strapi_api_tokens"
          WHERE datetime(created_at/1000, 'unixepoch') > '2023-09-01' AND datetime(created_at/1000, 'unixepoch') <= '2024-09-31'
          GROUP BY "year", "month"
        `)
      }
      const csvData = stats.map(row => {
        return Object.values(row).join(';')
      }).join('\n');
      ctx.set('Content-Type', 'text/plain');
      ctx.send(csvData);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getCsv2(ctx) {
    const csvData = 'a;b;c\n1;2;3';
    ctx.set('Content-Type', 'text/plain');
    // ctx.set('Content-Type', 'text/csv');
    // ctx.set('Content-Type', 'application/octet-stream');
    // ctx.set('Content-Disposition', 'attachment; filename="2024.csv"');
    ctx.send(csvData);
    // ctx.body = 'todo';
  },
};
