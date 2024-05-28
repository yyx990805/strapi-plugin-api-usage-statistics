'use strict';

module.exports = {
  async getCsv(ctx) {
    const csvData = 'a;b;c\n1;2;3';
    ctx.set('Content-Type', 'text/plain');
    // ctx.set('Content-Type', 'text/csv');
    // ctx.set('Content-Type', 'application/octet-stream');
    // ctx.set('Content-Disposition', 'attachment; filename="2024.csv"');
    ctx.send(csvData);
    // ctx.body = 'todo';
  },
};
