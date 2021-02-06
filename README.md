# serverless-apigateway-route-settings

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![CircleCI](https://circleci.com/gh/talbotp/serverless-apigateway-route-settings.svg?style=svg)](https://circleci.com/gh/talbotp/serverless-apigateway-route-settings) [![npm](https://img.shields.io/npm/v/serverless-apigateway-route-settings.svg)](https://www.npmjs.com/package/serverless-apigateway-route-settings) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/talbotp/serverless-apigateway-route-settings/issues)


## About

A <a href="https://serverless.com/" target="_blank">Serverless Framework</a> Plugin which helps you configure route specific variables, such as throttling rate limits, detailed metrics etc (see <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html" target="_blank">CloudFormation RouteSettings</a>) for Api Gateway v2 (HTTP). Also allows defaults to be set in the custom attribute of your serverless.yml.

## Supported RouteSettings 

ApiGateway v2 seems to only accept the following RouteSettings for Api Gateway v2 (HTTP):

* ThrottlingBurstLimit
* ThrottlingRateLimit
* DetailedMetricsEnabled

## Get Started

```bash
npm install serverless-apigateway-route-settings
```
or
```bash
yarn add serverless-apigateway-route-settings
```

Edit your serverless.yml to use this plugin:

```yml
plugins:
  - serverless-apigateway-route-settings
```

Next, edit your serverless.yml for <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings" target="_blank">DefaultRouteSettings</a>. What you enter here will be the default for each route in the stage.

```yml
custom:
  routeSettings:
    burstLimit: 200
    rateLimit: 400
    detailedMetricsEnabled: true
```

You can override the default route settings/account defaults by configuring at the route level. for example:

```yml
functions:
  hello:
    handler: src/throttle_me.handler
    events:
      - httpApi:
          path: /hello
          method: GET
          routeSettings:
            rateLimit: 10
            burstLimit: 5
            detailedMetricsEnabled: false
```

## Caveats

* Currently, if we are to deploy with default route settings specified, then remove them, they will persist, you MUST specify new default route settings. I aim to fix this in an update, will default to account levels.
* Doesn't work with pre existing API Gateways, eg if they are existing and we simply add routes in the serverless.yml. It is possible to add this plugin to an existing api gateway which is handled by serverless however.
  
## Example serverless.yml

```yml
service: example

frameworkVersion: '2'

plugins:
  - serverless-apigateway-route-settings

custom: 
  routeSettings:
    detailedMetricsEnabled: true
    rateLimit: 200
    burstLimit: 30

provider:
  name: aws
  runtime: nodejs12.x

functions:
  # Inherits the default route settings.
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
          routeSettings:
            rateLimit: 10
            burstLimit: 3
```

## What will be added to your CloudFormation template?

* <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings" target="_blank">DefaultRouteSettings</a> will be added to your <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html" target="_blank">Stage</a>.
* <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings" target="_blank">RouteSettings</a> will be added to your <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html" target="_blank">Stage</a>.
* The <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html" target="_blank">DependsOn</a> attribute is edited for your <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html" target="_blank">Stage</a>. We simply add any <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html" target="_blank">Route's</a> with configured RouteSettings, to ensure the creation of the Routes before the Stage. Otherwise CloudFormation will error (as it tries to edit the RouteSettings for a Route that doesn't exist yet).

## Issues

If you encounter any bugs, please let me know [here](https://github.com/talbotp/serverless-apigateway-route-settings/issues), and I will aim to fix them soon :slightly_smiling_face:.
