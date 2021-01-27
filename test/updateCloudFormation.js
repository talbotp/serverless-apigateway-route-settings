'use strict';

const { expect } = require('chai');
const rewire = require('rewire');

const get = require('lodash.get');
const set = require('lodash.set');

const RouteSettings = require('../src/routeSettings');
const ucf = rewire('../src/updateCloudFormation');

const setIfDefined = ucf.__get__('setIfDefined');
const getRouteResourceName = ucf.__get__('getRouteResourceName');
const updateStageDependsOn = ucf.__get__('updateStageDependsOn');

describe('Test that CloudFormation template is updated correctly.', function() {

  describe('setIfUndefined: undefined value', function() {
    it('Should not be set', function() {
      const object = {};
      const key = 'Key';
      const value = undefined;

      setIfDefined(object, key, value);

      expect(object[key]).to.be.undefined;
    });
  });

  describe('setIfUndefined: defined value', function() {
    it('Should be set and equal.', function() {
      const object = {};
      const key = 'Key';
      const value = 1235;

      setIfDefined(object, key, value);

      expect(object[key]).to.equal(value);
    })
  });

  describe('getRouteResourceName: GET /hello/world', function() {
    it('Should Return HttpApiRouteGetHelloWorld', function() {
      const serverless = {};
      const resources = require('./routeKey-resources');
      set(serverless, 'service.provider.compiledCloudFormationTemplate.Resources', resources);

      const method = 'GET';
      const path = '/hello/world';
      const routeSettings = new RouteSettings(undefined, path, method, undefined, undefined, undefined);

      const expected = 'HttpApiRouteGetHelloWorld';
      expect(getRouteResourceName(serverless, routeSettings)).to.equal(expected);
    })
  });

  describe('getRouteResourceName: PUT /test', function() {
    it('Should Return RandomRouteName123', function() {
      const serverless = {};
      const resources = require('./routeKey-resources');
      set(serverless, 'service.provider.compiledCloudFormationTemplate.Resources', resources);

      const method = 'PUT';
      const path = '/test';
      const routeSettings = new RouteSettings(undefined, path, method, undefined, undefined, undefined);

      const expected = 'RandomRouteName123';
      expect(getRouteResourceName(serverless, routeSettings)).to.equal(expected);
    })
  });

  describe('updateStageDependsOn DependsOn=undefined', function() {
    it('It should equal [routeKey]', function() {
      const routeResourceName = 'Route_Resource_Name_123';
      const serverless = {};
      const cfTemplate = require('./dependsOn-template.json');
      set(serverless, `service.provider.compiledCloudFormationTemplate`, cfTemplate);

      // Update the dependson for the stage to be undefined for this test.
      set(serverless, `service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.DependsOn`, undefined);

      updateStageDependsOn(serverless, routeResourceName);

      const actual = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.DependsOn`);
      const expected = [routeResourceName];
      expect(actual).to.be.eql(expected);
    })
  });

  describe('updateStageDependsOn DependsOn="OtherDependency"', function() {
    it('It should equal [routeKey]', function() {
      const routeResourceName = 'Route_Resource_Name_123';
      const serverless = {};
      const cfTemplate = require('./dependsOn-template.json');
      set(serverless, `service.provider.compiledCloudFormationTemplate`, cfTemplate);

      // Update the dependson for the stage to be undefined for this test.
      set(serverless, `service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.DependsOn`, "OtherDependency");

      updateStageDependsOn(serverless, routeResourceName);

      const actual = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.DependsOn`);
      const expected = ["OtherDependency", routeResourceName];
      expect(actual).to.be.eql(expected);
    })
  });

  describe('updateStageDependsOn DependsOn=LIST', function() {
    it('It should equal [routeKey]', function() {
      const routeResourceName = 'Route_Resource_Name_123';
      const serverless = {};
      const cfTemplate = require('./dependsOn-template.json');
      set(serverless, `service.provider.compiledCloudFormationTemplate`, cfTemplate);

      // Update the dependson for the stage to be undefined for this test.
      set(serverless, `service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.DependsOn`, ['Dep1', 'Dep2', 1234]);

      updateStageDependsOn(serverless, routeResourceName);

      const actual = get(serverless, `service.provider.compiledCloudFormationTemplate.Resources.HttpApiStage.DependsOn`);
      const expected = ['Dep1', 'Dep2', 1234, routeResourceName];
      expect(actual).to.be.eql(expected);
    })
  });

});
