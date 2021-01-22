'use strict';

const get = require('lodash.get');
const set = require('lodash.set');
const isEmpty = require('lodash.isempty');

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
    serverless.cli.log('[serverless-httpApi-route-settings] No Default Routen Settings are being added to CloudFormation.');
    return;
  }

  const template = get(serverless, 'service.provider.compiledCloudFormationTemplate');

  const HttpApiStage = getStageName(serverless);

  setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.DefaultRouteettings.DataTraceEnabled',        defaultSettings.dataTraceEnabled);
  setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.DefaultRouteSettings.DetailedMetricsEnabled', defaultSettings.detailedMetricsEnabled);
  setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.DefaultRouteSettings.LoggingLevel',           defaultSettings.loggingLevel);
  setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.DefaultRouteSettings.ThrottlingBurstLimit',   defaultSettings.burstLimit);
  setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.DefaultRouteSettings.ThrottlingRateLimit',    defaultSettings.rateLimit);
}

const getRouteKey = (routeSettings) => {
  return `${routeSettings.method} ${routeSettings.path}`;
}

const updateRouteSettings = (serverless, routeSettings) => {
  if (!routeSettings || isEmpty(routeSettings)) {
    return;
  }
  const template = get(serverless, 'service.provider.compiledCloudFormationTemplate');
  const HttpApiStage = getStageName(serverless);
  const routeKey = getRouteKey(routeSettings);

  // console.log(template.Resources.HttpApiRoutePutPoop.Properties.ApiId);
  // console.log(template.Resources.HttpApiRoutePutPoop.Properties.Target);
  // throw "poop";

  console.log(routeKey)
  console.log(routeSettings.functionName)

  routeSettings = {
    'GET hello': {
      ThrottlingBurstLimit: 100
    }
  };

  set(template, 'Resources.' + HttpApiStage + '.Properties.RouteSettings', routeSettings)

  // setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.RouteSettings.' + routeKey + '.DataTraceEnabled',       routeSettings.dataTraceEnabled);
  // setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.RouteSettings.' + routeKey + '.DetailedMetricsEnabled', routeSettings.detailedMetricsEnabled);
  // setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.RouteSettings.' + routeKey + '.LoggingLevel',           routeSettings.loggingLevel);
  // setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.RouteSettings.' + routeKey + '.ThrottlingBurstLimit',   routeSettings.burstLimit);
  // setIfDefined(template, 'Resources.' + HttpApiStage + '.Properties.RouteSettings./fuck/my/ass.ThrottlingRateLimit',    routeSettings.rateLimit);
}

const updateCloudformation = (serverless, settings) => {
  if (isEmpty(settings)) {
    return;
  }

  updateDefaultRouteSettings(serverless, settings.defaultRouteSettings);

  console.log(serverless.service.provider.compiledCloudFormationTemplate.Resources);

  // Next update individual route settings.
  for (let routeSettings of settings.routeSettings) {
    updateRouteSettings(serverless, routeSettings);
  }

  console.log(serverless.service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.Properties);
}

module.exports = updateCloudformation;