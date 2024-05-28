module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/stats.csv',
      handler: 'csv.getCsv',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}.routes;
