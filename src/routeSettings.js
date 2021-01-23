'use strict';

const get = require('lodash.get');

class RouteSettings {

  constructor(functionName, path, method, dataTraceEnabled, detailedMetricsEnabled, loggingLevel, burstLimit, rateLimit) {
    this.functionName           = functionName;
    this.path                   = path;
    this.method                 = method;
    this.dataTraceEnabled       = dataTraceEnabled;
    this.detailedMetricsEnabled = detailedMetricsEnabled;
    this.loggingLevel           = loggingLevel;
    this.burstLimit             = burstLimit;
    this.rateLimit              = rateLimit;
  }

  static buildDefaultRouteSettings(serverless) {
    const dataTraceEnabled  = get(serverless, 'service.custom.httpApiRouteSettings.dataTraceEnabled');
    const metricsEnabled    = get(serverless, 'service.custom.httpApiRouteSettings.detailedMetricsEnabled');
    const loggingLevel      = get(serverless, 'service.custom.httpApiRouteSettings.loggingLevel');
    const burstLimit        = get(serverless, 'service.custom.httpApiRouteSettings.burstLimit');
    const rateLimit         = get(serverless, 'service.custom.httpApiRouteSettings.rateLimit');
    return new RouteSettings(undefined, undefined, undefined, dataTraceEnabled, metricsEnabled, loggingLevel, burstLimit, rateLimit);
  }

  static buildRouteSettings(functionName, event) {
    const path              = get(event, 'httpApi.path');
    const method            = get(event, 'httpApi.method');
    const dataTraceEnabled  = get(event, 'httpApi.httpApiRouteSettings.dataTraceEnabled');
    const metricsEnabled    = get(event, 'httpApi.httpApiRouteSettings.detailedMetricsEnabled');
    const loggingLevel      = get(event, 'httpApi.httpApiRouteSettings.loggingLevel');
    const burstLimit        = get(event, 'httpApi.httpApiRouteSettings.burstLimit');
    const rateLimit         = get(event, 'httpApi.httpApiRouteSettings.rateLimit');
    return new RouteSettings(functionName, path, method, dataTraceEnabled, metricsEnabled, loggingLevel, burstLimit, rateLimit)
  }

}

module.exports = RouteSettings;
