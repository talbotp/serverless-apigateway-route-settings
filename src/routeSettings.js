'use strict';

const get = require('lodash.get');

const config = require('./config');

/**
 * ThrottlingRateLimit and ThrottlingBurstLimit must be non negative integers.
 */
const isNonNegativeInteger = (val) => {
  return Number.isInteger(val) && val >= 0;
}

class RouteSettings {

  constructor(functionName, path, method, detailedMetricsEnabled, burstLimit, rateLimit) {
    this.functionName           = functionName;
    this.path                   = path;
    this.method                 = method;
    this.detailedMetricsEnabled = detailedMetricsEnabled;
    this.burstLimit             = burstLimit;
    this.rateLimit              = rateLimit;
    this.validate();
  }

  /**
   * Validate RouteSettings. Note, functionName, path and method are provided by serverless, so no need to validate these.
   */
  validate() {
    if (!(typeof this.detailedMetricsEnabled === 'undefined') && !(typeof this.detailedMetricsEnabled === 'boolean')) {
      throw new Error(`[${config.app}] detailedMetricsEnabled must be boolean.`);
    }

    if (!(typeof this.burstLimit === 'undefined') && !isNonNegativeInteger(this.burstLimit)) {
      throw new Error(`[${config.app}] burstLimit must be greater than or equal to 0.`);
    }

    if (!(typeof this.rateLimit === 'undefined') && !isNonNegativeInteger(this.rateLimit)) {
      throw new Error(`[${config.app}] rateLimit must be greater than or equal to 0.`);
    }
  }

  static buildDefaultRouteSettings(serverless) {
    const metricsEnabled  = get(serverless, `service.custom.${config.key}.detailedMetricsEnabled`);
    const burstLimit      = get(serverless, `service.custom.${config.key}.burstLimit`);
    const rateLimit       = get(serverless, `service.custom.${config.key}.rateLimit`);
    return new RouteSettings(undefined, undefined, undefined, metricsEnabled, burstLimit, rateLimit);
  }

  static buildRouteSettings(functionName, event) {
    const path            = get(event, `httpApi.path`);
    const method          = get(event, `httpApi.method`);
    const metricsEnabled  = get(event, `httpApi.${config.key}.detailedMetricsEnabled`);
    const burstLimit      = get(event, `httpApi.${config.key}.burstLimit`);
    const rateLimit       = get(event, `httpApi.${config.key}.rateLimit`);
    return new RouteSettings(functionName, path, method, metricsEnabled, burstLimit, rateLimit)
  }

}

module.exports = RouteSettings;
