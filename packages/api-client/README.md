# api-client

This package contains the base class for the Drupal API Client. For more information, see https://www.drupal.org/project/api_client for more information about this project.

## Installation

```shell
npm install @drupal-api-client/api-client
```

## Usage

The `ApiClient` is a base class meant to be extended.
The base class includes the following parameters:

- `BaseUrl`: The url to use for all API requests
- `apiPrefix`: The base path for the JSON:API endpoint
- `cache`: An optional caching interface
- `customFetch`: An optional method to use in place of the default `fetch` method
- `authentication`: Optional credentials for authenticated requests
- `defaultLocale`: An optional locale to use for requests by default.

For an example of an extended `ApiClient`, see [`JsonApiClient`](https://git.drupalcode.org/project/api_client/-/blob/canary/packages/json-api-client/README.md)
