# serverless-apigateway-route-settings

[![CircleCI](https://circleci.com/gh/talbotp/serverless-apigateway-route-settings.svg?style=svg)](https://circleci.com/gh/talbotp/serverless-apigateway-route-settings) [![npm](https://img.shields.io/npm/v/serverless-apigateway-route-settings.svg)](https://www.npmjs.com/package/serverless-apigateway-route-settings) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/talbotp/serverless-apigateway-route-settings/issues)


## About

A <a href="https://serverless.com/" target="_blank">Serverless Framework</a> Plugin which helps you configure route specific variables, such as *throttling rate limits, detailed metrics etc (see <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html" target="_blank">CloudFormation RouteSettings</a>) for Api Gateway v2 (HTTP).

Note: Currently only works for <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings">Default Route Settings</a>, I am hoping to allow route specific override in a future update.

## Supported RouteSettings 

ApiGateway v2 seems to only accept the following RouteSettings for Api Gateway v2 (HTTP):

* ThrottlingBurstLimit
* ThrottlingRateLimit
* DetailedMetricsEnabled

## Get Started

```bash
npm install serverless-apigateway-route-settings
```

Edit your serverless.yml to use this plugin:

```yml
plugins:
  - serverless-apigateway-route-settings
```

Next, edit your serverless.yml for <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings" target="_blank">DefaultRouteSettings</a>

```yml
custom:
  httpApiRouteSettings:
    burstLimit: 200
    rateLimit: 400
    detailedMetricsEnabled: true
```

## Caveats

* Only DefaultRouteSettings are currently supported, I'm currently trying to get CloudFormation to work with RouteSettings for individual routes to override this.
* Doesn't work with pre existing API Gateways, hoping to add support for this.
  
## Example serverless.yml

```yml
service: example

frameworkVersion: '2'

plugins:
  - serverless-apigateway-route-settings

custom: 
  httpApiRouteSettings:
    detailedMetricsEnabled: true
    rateLimit: 200
    burstLimit: 30

provider:
  name: aws
  runtime: nodejs12.x

functions:
  # Inherits the default throttle rate limits.
  hello:
    handler: src/helloWorld.handler
    events:
      - httpApi:
          path: /hello
          method: GET

  # Overrides the default throttle rate limits.
  lowerRateLimit:
    handler: src/lowerRateLimit.handler
    events:
      - httpApi:
          path: /throttle
          method: GET
```