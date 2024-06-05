const pluginId = 'strapi-plugin-api-usage-statistics';
import React from 'react';

const gatherStatsMiddleware = require('./middlewares/index');

export default {
  register(app) {

    strapi.server.use(gatherStatsMiddleware.gatherStats);

    app.addMenuLink({
      // to: `/plugins/${pluginId}/download`,
      to: `/../${pluginId}/stats.csv`,
      icon: function DownloadIcon() {
        console.log('download icon')
        return React.createElement('i', {
          className: 'fa fa-download',
          onClick(ev) {
            // debugger
            ev.stopPropagation();
          },
        }, 'icon');
      },
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'stats.csv',
      },
      Component: function DownloadCsv() {
        // debugger
        console.info('component def')
        return React.createElement('div', {}, 'hello plugin');
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      isReady: true,
      name: 'CSV Export',
    });
  }
}
