'use strict';

const get = require('lodash.get');
const set = require('lodash.set');
const isEmpty = require('lodash.isempty');

const config = require('./config');

const getStageName = (serverless) => {
  return 'HttpApiStage';
}

const setIfDefined = (object, path, value) => {
  if (!value) {
    return;
  }
  set(object, path, value);
}

const updateDefaultRouteSettings = (serverless, defaultSettings) => {
  if (!defaultSettings || isEmpty(defaultSettings)) {
    serverless.cli.log(`[${config.app}] No Default Routen Settings are being added to CloudFormation.`);
    return;
  }

  const HttpApiStage = getStageName(serverless);
  const stageProperties = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.${HttpApiStage}.Properties`);

  setIfDefined(stageProperties, `DefaultRouteettings.DataTraceEnabled`,        defaultSettings.dataTraceEnabled);
  setIfDefined(stageProperties, `DefaultRouteSettings.LoggingLevel`,           defaultSettings.loggingLevel);
  setIfDefined(stageProperties, `DefaultRouteSettings.DetailedMetricsEnabled`, defaultSettings.detailedMetricsEnabled);
  setIfDefined(stageProperties, `DefaultRouteSettings.ThrottlingBurstLimit`,   defaultSettings.burstLimit);
  setIfDefined(stageProperties, `DefaultRouteSettings.ThrottlingRateLimit`,    defaultSettings.rateLimit);

  console.log(stageProperties);
}

const getRouteKey = (routeSettings) => {
  return `${routeSettings.method} ${routeSettings.path}`;
}

const updateRouteSettings = (serverless, routeSettings) => {
  if (!routeSettings || isEmpty(routeSettings)) {
    return;
  }

  const HttpApiStage = getStageName(serverless);
  const stageProperties = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.${HttpApiStage}.Properties`);
  const routeKey = getRouteKey(routeSettings);

  setIfDefined(stageProperties, `RouteSettings.${routeKey}.DataTraceEnabled`,       routeSettings.dataTraceEnabled);
  setIfDefined(stageProperties, `RouteSettings.${routeKey}.DetailedMetricsEnabled`, routeSettings.detailedMetricsEnabled);
  setIfDefined(stageProperties, `RouteSettings.${routeKey}.LoggingLevel`,           routeSettings.loggingLevel);
  setIfDefined(stageProperties, `RouteSettings.${routeKey}.ThrottlingBurstLimit`,   routeSettings.burstLimit);
  setIfDefined(stageProperties, `RouteSettings.${routeKey}.ThrottlingRateLimit`,    routeSettings.rateLimit);
}

const updateCloudformation = (serverless, settings) => {
  if (isEmpty(settings)) {
    return;
  }

  updateDefaultRouteSettings(serverless, settings.defaultRouteSettings);

  serverless.cli.log(`[${config.app}] Ignoring Individual Route Settings until future update, only default route settings are currently supported.`);

  // Next update individual route settings.
  // for (let routeSettings of settings.routeSettings) {
  //   updateRouteSettings(serverless, routeSettings);
  // }

}

module.exports = updateCloudformation;