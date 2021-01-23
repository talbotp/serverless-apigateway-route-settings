# serverless-apigateway-route-settings

![npm](https://img.shields.io/npm/v/serverless-apigateway-route-settings.svg)

## About

A <a href="https://serverless.com/" target="_blank">Serverless Framework</a> Plugin which helps you configure route specific variables, such as throttling rate limits, logging levels etc (see <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html" target="_blank">CloudFormation RouteSettings</a>) for Api Gateway v2 (HTTP).

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
  - serverless-http-api-helper

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