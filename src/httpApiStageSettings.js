'use strict';

const get = require('lodash.get');
const isEmpty = require('lodash.isempty');

const RouteSettings = require('./routeSettings');

class HttpApiStageSettings {

  constructor(serverless, options) {
    if (!get(serverless, 'service.custom.httpApiRouteSettings')) {
      serverless.cli.log('[serverless-httpApi-route-settings] Warning: No default Route Settings have been provided.');
    }

    if (!get(serverless, 'service.functions')) {
      serverless.cli.log('[serverless-httpApi-route-settings] Warning: No functions defined.');
      return;
    }

    // Build the default RouteSettings object.
    this.defaultRouteSettings = RouteSettings.buildDefaultRouteSettings(serverless);

    this.routeSettings = [];

    for (let functionName in serverless.service.functions) {
      let functionSettings = serverless.service.functions[functionName];

      if (isEmpty(functionSettings.events)) {
        continue;
      }

      // For each event, we build a route settings object.
      for (let event of functionSettings.events) {
        if (get(event, 'httpApi')) {
          this.routeSettings.push(RouteSettings.buildRouteSettings(functionName, event));
        }
      }
    }
  }

}

module.exports = HttpApiStageSettings;
