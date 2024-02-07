# decoupled-router-client

This package contains the `DecoupledRouterClient` class which extends the base `ApiClient` class from the `@drupal-api-client/api-client` package. See https://www.drupal.org/project/api_client for more information about this project.

## Installation

```shell
npm install @drupal-api-client/decoupled-router-client
```

## Usage

This class includes the following parameters:

- `baseUrl`: The url to use for all API requests
- `apiPrefix`: The base path for the JSON:API endpoint
- `cache`: An optional caching interface
- `customFetch`: An optional method to use in place of the default `fetch` method
- `authentication`: Optional credentials for authenticated requests
- `defaultLocale`: An optional locale to use for requests by default.
