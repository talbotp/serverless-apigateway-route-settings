# serverless-httpApi-route-settings

## About

A <a href="https://serverless.com/" target="_blank">Serverless Framework</a> Plugin which helps you configure route specific variables, such as throttling rate limit etc.

## Get Started

```bash
npm install serverless-http-api-helper
```

Edit your serverless.yml to use this plugin:

```yml
plugins:
  - serverless-http-api-helper
```

## What HttpApi Settings Can I Use?

  
## Example serverless.yml

```yml
service: example

frameworkVersion: '2'

plugins:
  - serverless-http-api-helper

custom: 
  httpApiRouteSettings:
    # These will be the default route settings throttling limits
    # unless overridden.
    burstLimit: 200
    rateLimit: 400

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
          httpApiRouteSettings:
            burstLimit: 5
            rateLimit: 10
```