'use strict';

const get = require('lodash.get');
const set = require('lodash.set');
const isEmpty = require('lodash.isempty');

const config = require('./config');

const getStageName = () => {
  return 'HttpApiStage';
}

const setIfDefined = (object, path, value) => {
  if (typeof value === 'undefined') {
    return;
  }
  set(object, path, value);
}

const getRouteResourceName = (serverless, routeSettings) => {
  const resources = get(serverless, 'service.provider.compiledCloudFormationTemplate.Resources');
  const routeKey  = routeSettings.getRouteKey();
  return Object.keys(resources).find(key => 
    get(resources, `${key}.Properties.RouteKey`) === routeKey
  ); 
}

// Need CloudFormation to build the Routes first, so specify them in 
// DependsOn.
const updateStageDependsOn = (serverless, routeResourceName) => {
  const HttpApiStage = getStageName();
  const stage = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.${HttpApiStage}`);
  const dependsOn = get(stage, 'DependsOn');

  if (typeof dependsOn === 'undefined') {
    set(stage, 'DependsOn', [routeResourceName]);
  } else if (typeof dependsOn === 'string') {
    set(stage, 'DependsOn', [dependsOn, routeResourceName]);
  } else if (Array.isArray(dependsOn)) {
    dependsOn.push(routeResourceName);
    set(stage, 'DependsOn', dependsOn);
  } else {
    throw new Error(`[${config.app}] Unexpected DependsOn${dependsOn} for ${HttpApiStage}.`);
  }
}

const updateDefaultRouteSettings = (serverless, defaultSettings) => {
  if (!defaultSettings || isEmpty(defaultSettings)) {
    serverless.cli.log(`[${config.app}] No Default Route Settings are being added to CloudFormation.`);
    return;
  }

  const HttpApiStage = getStageName();
  const stageProperties = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.${HttpApiStage}.Properties`);

  setIfDefined(stageProperties, `DefaultRouteSettings.DetailedMetricsEnabled`, defaultSettings.detailedMetricsEnabled);
  setIfDefined(stageProperties, `DefaultRouteSettings.ThrottlingBurstLimit`,   defaultSettings.burstLimit);
  setIfDefined(stageProperties, `DefaultRouteSettings.ThrottlingRateLimit`,    defaultSettings.rateLimit);
}

const updateRouteSettings = (serverless, routeSettings) => {
  if (!routeSettings || isEmpty(routeSettings)) {
    return;
  }

  const HttpApiStage = getStageName();
  const stageProperties = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.${HttpApiStage}.Properties`);
  const routeKey = routeSettings.getRouteKey();

  const routeResourceName = getRouteResourceName(serverless, routeSettings);
  if (typeof routeResourceName === 'undefined') {
    serverless.cli.log(`[${config.app}] Warning: Unable to update settings for ${routeKey}`);
    return;
  }

  // Update the DependsOn field on the stage to ensure that the route is built first.
  updateStageDependsOn(serverless, routeResourceName);

  setIfDefined(stageProperties, `RouteSettings.${routeKey}.DetailedMetricsEnabled`, routeSettings.detailedMetricsEnabled);
  setIfDefined(stageProperties, `RouteSettings.${routeKey}.ThrottlingBurstLimit`,   routeSettings.burstLimit);
  setIfDefined(stageProperties, `RouteSettings.${routeKey}.ThrottlingRateLimit`,    routeSettings.rateLimit);
}

const updateCloudformation = (serverless, settings) => {
  if (isEmpty(settings)) {
    return;
  }

  updateDefaultRouteSettings(serverless, settings.defaultRouteSettings);

  // Next update individual route settings.
  for (let routeSettings of settings.routeSettings) {
    updateRouteSettings(serverless, routeSettings);
  }

}

module.exports = updateCloudformation;
