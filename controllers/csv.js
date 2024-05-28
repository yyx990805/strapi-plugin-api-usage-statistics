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

      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      
      const stats = await strapi.query('api::stat.stat').findMany({
        where: {
          createdAt: {
            $gte: start.toISOString(),
            $lt: end.toISOString()
          }
        }
      });
      const csvData = stats.map(row =>
        Object.values(row).join(';')
      ).join('\n');
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
