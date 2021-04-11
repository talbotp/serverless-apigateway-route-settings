'use strict';

const get = require('lodash.get');

const config = require('./config');

const isNonNegativeInteger = val => Number.isInteger(val) && val >= 0;

const isLoggingLevel = val => val === 'INFO' || val === 'ERROR' || val === 'OFF';

const chooseSetting = (routeSetting, defaultSetting) => {
  if (typeof routeSetting !== 'undefined') {
    return routeSetting;
  }
  return defaultSetting;
}

class RouteSettings {

  constructor(functionName, path, method, route, detailedMetricsEnabled, burstLimit, rateLimit, dataTraceEnabled, loggingLevel) {
    this.functionName           = functionName;
    this.path                   = path;
    this.method                 = method;
    this.detailedMetricsEnabled = detailedMetricsEnabled;
    this.burstLimit             = burstLimit;
    this.rateLimit              = rateLimit;

    /* Websocket only fields */
    this.dataTraceEnabled       = dataTraceEnabled;
    this.loggingLevel           = loggingLevel;

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

    if (!(typeof this.dataTraceEnabled === 'undefined') && !(typeof this.dataTraceEnabled === 'boolean')) {
      throw new Error(`[${config.app}] dataTraceEnabled must be boolean.`);
    }

    if (!(typeof this.loggingLevel === 'undefined') && !isLoggingLevel(this.loggingLevel)) {
      throw new Error(`[${config.app}] loggingLevel must be one of INFO, ERROR or OFF.`);
    }
  }

  getRouteKey() {
    if (this.route) {
      return this.route;
    }
    return `${this.method} ${this.path}`;
  }

  static buildDefaultRouteSettings(serverless) {
    const metricsEnabled    = get(serverless, `service.custom.${config.key}.detailedMetricsEnabled`);
    const burstLimit        = get(serverless, `service.custom.${config.key}.burstLimit`);
    const rateLimit         = get(serverless, `service.custom.${config.key}.rateLimit`);
    const dataTraceEnabled  = get(serverless, `service.custom.${config.key}.dataTraceEnabled`);
    const loggingLevel      = get(serverless, `service.custom.${config.key}.loggingLevel`);
    return new RouteSettings(undefined, undefined, undefined, undefined, metricsEnabled, burstLimit, rateLimit, dataTraceEnabled, loggingLevel);
  }

  static buildRouteSettings(functionName, event, defaultRouteSettings) {
    const path            = get(event, `httpApi.path`);
    const method          = get(event, `httpApi.method`);
    const metricsEnabled  = get(event, `httpApi.${config.key}.detailedMetricsEnabled`);
    const burstLimit      = get(event, `httpApi.${config.key}.burstLimit`);
    const rateLimit       = get(event, `httpApi.${config.key}.rateLimit`);

    // Must choose default route settings if otherwise undefined, or will use account limits.
    const actualMetricsEnabled  = chooseSetting(metricsEnabled, defaultRouteSettings.metricsEnabled);
    const actualBurstLimit      = chooseSetting(burstLimit, defaultRouteSettings.burstLimit);
    const actualRateLimit       = chooseSetting(rateLimit, defaultRouteSettings.rateLimit);

    return new RouteSettings(functionName, path, method, undefined, actualMetricsEnabled, actualBurstLimit, actualRateLimit, undefined, undefined);
  }

  static buildWsRouteSettings(functionName, event, defaultRouteSettings) {
    const route = (typeof event.websocket === 'string') ? event.websocket : get(event, 'websocket.route');
    const metricsEnabled    = get(event, `websocket.${config.key}.detailedMetricsEnabled`);
    const burstLimit        = get(event, `websocket.${config.key}.burstLimit`);
    const rateLimit         = get(event, `websocket.${config.key}.rateLimit`);
    const dataTraceEnabled  = get(event, `websocket.${config.key}.dataTraceEnabled`);
    const loggingLevel      = get(event, `websocket.${config.key}.loggingLevel`);

    // Must choose default route settings if otherwise undefined, or will use account limits.
    const actualMetricsEnabled    = chooseSetting(metricsEnabled, defaultRouteSettings.metricsEnabled);
    const actualBurstLimit        = chooseSetting(burstLimit, defaultRouteSettings.burstLimit);
    const actualRateLimit         = chooseSetting(rateLimit, defaultRouteSettings.rateLimit);
    const actualDataTraceEnabled  = chooseSetting(dataTraceEnabled, defaultRouteSettings.dataTraceEnabled);
    const actualLoggingLevel      = chooseSetting(loggingLevel, defaultRouteSettings.loggingLevel);

    return new RouteSettings(
      functionName, 
      undefined, 
      undefined, 
      route, 
      actualMetricsEnabled, 
      actualBurstLimit, 
      actualRateLimit, 
      actualDataTraceEnabled, 
      actualLoggingLevel
    );
  }

}

module.exports = RouteSettings;
