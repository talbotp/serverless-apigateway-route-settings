'use strict';

const config = {};

/**
 *  App name for logging etc.
 */
config.app = 'serverless-apigateway-route-settings';

/**
 * Key in serverless.yml where users will store the Route Settings Data.
 */
config.key = 'routeSettings';

/**
 * Schema for the routeSettings object in the serverless.yml.
 */
config.validationSchema = {
  type: 'object',
  properties: {
    routeSettings: {
      properties: {
        detailedMetricsEnabled: { type: 'boolean' },
        burstLimit: { type: 'number' },
        rateLimit: { type: 'number' }
      }
    }
  }
};

module.exports = config;
