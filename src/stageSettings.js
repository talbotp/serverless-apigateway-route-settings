'use strict';

const get = require('lodash.get');
const isEmpty = require('lodash.isempty');

const config = require('./config');
const RouteSettings = require('./routeSettings');

class StageSettings {

  constructor(serverless) {
    if (!get(serverless, `service.custom.${config.key}`)) {
      serverless.cli.log(`[${config.app}] Warning: No default Route Settings have been provided.`);
    }

    if (!get(serverless, 'service.functions')) {
      serverless.cli.log(`[${config.app}] Warning: No functions defined.`);
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
        if (get(event, `httpApi.${config.key}`)) {
          this.routeSettings.push(RouteSettings.buildRouteSettings(functionName, event, this.defaultRouteSettings));
        }
      }
    }

    if (this.routeSettings.length === 0) {
      serverless.cli.log(`[${config.app}] Warning: No RouteSettings have been provided to override the DefaultRouteSettings.`)
    }
  }

}

module.exports = StageSettings;
