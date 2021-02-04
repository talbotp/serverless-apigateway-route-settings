'use strict';

const config = require('./config');
const StageSettings = require('./stageSettings');
const updateCloudFormation = require('./updateCloudFormation');

class ApiGatewayRouteSettingsPlugin {

  constructor(serverless, options) {
    this.serverless = serverless;
    this.options    = options;

    this.hooks = {
      'before:package:initialize':  this.buildSettings.bind(this),
      'before:package:finalize':    this.addToCloudFormation.bind(this)
    };

    this.validationSchema();
  }

  /**
   * This is where we build settings that are later added to CloudFormation APIGateway Stage.
   */
  buildSettings() {
    this.serverless.cli.log(`[${config.app}] Building Route Settings for Api Gateway.`);
    this.settings = new StageSettings(this.serverless);
  }

  /**
   * Add to the Cloudformation ApiGateway Stage.
   */
  addToCloudFormation() {
    this.serverless.cli.log(`[${config.app}] Updating CloudFormation with Route Settings.`);
    updateCloudFormation(this.serverless, this.settings);
  }

  /**
   * Make sure that Serverless doesn't throw any warning when overriding DefaultRouteSettings for 
   * a Route.
   */
  validationSchema() {
    if (!this.serverless.configSchemaHandler
      || !this.serverless.configSchemaHandler.defineCustomProperties
      || !this.serverless.configSchemaHandler.defineFunctionEventProperties) {
      return;
    }

    this.serverless.configSchemaHandler.defineCustomProperties(config.validationSchema);
    this.serverless.configSchemaHandler.defineFunctionEventProperties('aws', 'httpApi', config.validationSchema);
  }

}

module.exports = ApiGatewayRouteSettingsPlugin;
