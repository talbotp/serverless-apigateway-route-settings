'use strict';

const HttpApiStageSettings  = require('./httpApiStageSettings');
const updateCloudformation  = require('./updateCloudformation');

class HttpApiRouteSettingsPlugin {

  constructor(serverless, options) {
    this.serverless = serverless;
    this.options    = options;

    this.hooks = {
      'before:package:initialize':  this.buildSettings.bind(this),
      'before:package:finalize':    this.populateStage.bind(this)
    };
  }

  /**
   * This is where we build settings that are later added to CloudFormation APIGateway Stage.
   */
  buildSettings() {
    this.serverless.cli.log('[serverless-httpApi-route-settings] Building httpApi Route Settings.');
    this.settings = new HttpApiStageSettings(this.serverless, this.options);
  }

  /**
   * Add to the Cloudformation ApiGateway Stage.
   */
  populateStage() {
    this.serverless.cli.log('[serverless-httpApi-route-settings] Populating CloudFormation with httpApi Route Settings.');
    updateCloudformation(this.serverless, this.settings);
  }

}

module.exports = HttpApiRouteSettingsPlugin;
