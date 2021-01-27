
const { expect } = require('chai');
const RouteSettings = require('../src/routeSettings');

const set = require('lodash.set');

describe('Test that Route Settings are created properly.', function() {

  context('Default Route Settings with a valid serverless.yml', function() {
    it('All fields should be filled with valid CloudFormation values', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.detailedMetricsEnabled', false);
      set(serverless, 'service.custom.routeSettings.burstLimit',             16);
      set(serverless, 'service.custom.routeSettings.rateLimit',              3);

      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);

      expect(routeSettings.detailedMetricsEnabled).to.equal(false);
      expect(routeSettings.burstLimit).to.equal(16);
      expect(routeSettings.rateLimit).to.equal(3)
    })
  })

  context('Default Route Settings with undefined detailedMetricsEnabled.', function() {
    it('Should work fine, other values should be set.', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.burstLimit', 5);
      set(serverless, 'service.custom.routeSettings.rateLimit',  9);

      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);

      expect(routeSettings.detailedMetricsEnabled).to.be.undefined;
      expect(routeSettings.burstLimit).to.equal(5);
      expect(routeSettings.rateLimit).to.equal(9)
    });
  })

  context('Default Route Settings with undefined throttlingRateLimit.', function() {
    it('Should work fine, other values should be set.', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.detailedMetricsEnabled', true);
      set(serverless, 'service.custom.routeSettings.burstLimit',             9);

      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);

      expect(routeSettings.detailedMetricsEnabled).to.equal(true);
      expect(routeSettings.burstLimit).to.equal(9);
      expect(routeSettings.rateLimit).to.be.undefined;
    });
  })

  context('Default Route Settings with undefined throttlingBurstLimit.', function() {
    it('Should work fine, other values should be set.', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.detailedMetricsEnabled', false);
      set(serverless, 'service.custom.routeSettings.burstLimit',             101);

      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);

      expect(routeSettings.detailedMetricsEnabled).to.equal(false);
      expect(routeSettings.burstLimit).to.equal(101);
      expect(routeSettings.rateLimit).to.be.undefined;  
    });
  })

  context('Default Route Settings with throttling levels set to 0.', function() {
    it('Should have all values mapped correctly.', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.detailedMetricsEnabled', true);
      set(serverless, 'service.custom.routeSettings.burstLimit',             0);
      set(serverless, 'service.custom.routeSettings.rateLimit',              0);

      const routeSettings = RouteSettings.buildDefaultRouteSettings(serverless);

      expect(routeSettings.detailedMetricsEnabled).to.equal(true);
      expect(routeSettings.burstLimit).to.equal(0);
      expect(routeSettings.rateLimit).to.equal(0)
    })
  });

  context('Default Route Settings with throttling levels negative.', function() {
    it('Should throw an error, throttling levels must be non negative.', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.detailedMetricsEnabled', true);
      set(serverless, 'service.custom.routeSettings.burstLimit',             -1);
      set(serverless, 'service.custom.routeSettings.rateLimit',              0);

      expect(() => { RouteSettings.buildDefaultRouteSettings(serverless); }).to.throw(Error);
    })
  });

  context('Default Route Settings with detailedMetricsEnabled as non boolean', function() { 
    it('Should throw an error, detailedMetricsEnabled must be boolean.', function() {
      const serverless = {};
      set(serverless, 'service.custom.routeSettings.detailedMetricsEnabled', 1);
      set(serverless, 'service.custom.routeSettings.burstLimit',             0);
      set(serverless, 'service.custom.routeSettings.rateLimit',              0);

      expect(() => { RouteSettings.buildDefaultRouteSettings(serverless); }).to.throw(Error);
    })
  });

  context('RouteSettings: Check Route Key is built properly.', function() {
    it('Should be of the form "METHOD PATH"', function() { 
      const functionName = 'HelloWorld';
      const event = {};
      set(event, 'httpApi.path', '/hello/world');
      set(event, 'httpApi.method', 'POST');
      const defaultRouteSettings = {};

      const routeSettings = RouteSettings.buildRouteSettings(functionName, event, defaultRouteSettings);
      const expected = 'POST /hello/world';
      expect(routeSettings.getRouteKey()).to.equal(expected);
    })
  })

  context('RouteSettings: Should override DefaultRouteSettings', function() {
    it('Should equal route settings values, ignore default route settings.', function() {
      const functionName = 'AwesomeFunction';
      const event = {};
      set(event, 'httpApi.path', 'POST');
      set(event, 'httpApi.method', '/hello/world');
      set(event, `httpApi.routeSettings.detailedMetricsEnabled`, true);
      set(event, `httpApi.routeSettings.burstLimit`, 156);
      set(event, `httpApi.routeSettings.rateLimit`, 3);

      const defaultRouteSettings = {
        detailedMetricsEnabled: false,
        rateLimit: 1000,
        burstLimit: 5000
      };

      const routeSettings = RouteSettings.buildRouteSettings(functionName, event, defaultRouteSettings);

      expect(routeSettings.detailedMetricsEnabled).to.equal(true);
      expect(routeSettings.burstLimit).to.equal(156);
      expect(routeSettings.rateLimit).to.equal(3);
    });
  });

  context('RouteSettings: Default Settings should be used when no certain routesettings are not present.', function() { 
    it('burstLimit should equal the default settings.', function() {
      const functionName = 'AwesomeFunction2';
      const event = {};
      set(event, 'httpApi.path', 'POST');
      set(event, 'httpApi.method', '/hello/world');
      set(event, `httpApi.routeSettings.detailedMetricsEnabled`, true);
      set(event, `httpApi.routeSettings.rateLimit`, 3);

      const defaultRouteSettings = {
        detailedMetricsEnabled: false,
        rateLimit: 1000,
        burstLimit: 5000
      };

      const routeSettings = RouteSettings.buildRouteSettings(functionName, event, defaultRouteSettings);

      expect(routeSettings.detailedMetricsEnabled).to.equal(true);
      expect(routeSettings.burstLimit).to.equal(5000);
      expect(routeSettings.rateLimit).to.equal(3);
    });
  });

});
