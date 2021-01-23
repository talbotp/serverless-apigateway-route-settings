
const { expect } = require('chai');
const RouteSettings = require('../src/routeSettings');

const set = require('lodash.set');

describe('Test that Route Settings are created properly.', function() {

  context('Default Route Settings all undefined', function() {
    it('All route settings should equal undefined.', function() {
      const serverless = {};
      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);
      Object.keys(routeSettings).forEach(key => {
        expect(routeSettings[key]).to.be.undefined;
      });
    })
  });

  context('Default Route Settings with a valid serverless.yml', function() {
    it('All fields should be filled with valid CloudFormation values', function() {
      const serverless = {};
      set(serverless, 'service.custom.httpApiRouteSettings.dataTraceEnabled',       true);
      set(serverless, 'service.custom.httpApiRouteSettings.detailedMetricsEnabled', false);
      set(serverless, 'service.custom.httpApiRouteSettings.loggingLevel',           'INFO');
      set(serverless, 'service.custom.httpApiRouteSettings.burstLimit',             16);
      set(serverless, 'service.custom.httpApiRouteSettings.rateLimit',              3);

      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);

      expect(routeSettings.dataTraceEnabled).to.equal(true);
      expect(routeSettings.detailedMetricsEnabled).to.equal(false);
      expect(routeSettings.loggingLevel).to.equal('INFO');
      expect(routeSettings.burstLimit).to.equal(16);
      expect(routeSettings.rateLimit).to.equal(3)
    })
  })

  context('Default Route Settings with invalid parameters in serverless.yml', function() {
    it('Should throw an error', function() {
      console.log('TODO');
    })
  });

});