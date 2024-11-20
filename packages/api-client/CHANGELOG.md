# @drupal-api-client/api-client

## 1.3.0

### Minor Changes

- 6225317: Added support for OAuth Password Grant

## 1.1.0

### Minor Changes

- 1830ea4: Changed to MIT license.

## 1.0.0

### Major Changes

- 714b7dd: 1.0 release of api-client, decoupled-router-client, and json-api-client

## 0.7.2

### Patch Changes

- e8bcdaf: Target es2020 for bundles.

## 0.7.0

### Minor Changes

- 3da2de9: Adds disable authentication option.

  - All methods that make fetch requests now accept a 'disableAuthentication' option.
    if 'true' no authorization headers will be added for the related fetch request.

## 0.6.0

### Minor Changes

- adef533: Update ApiClient Serializer Type to Include serialize method

  - Serializer option now accepts a serialize method. This method
    is not currently used internally, but can be accessed on the
    client to simplify working with deserialized data.

## 0.5.0

### Minor Changes

- 2285c8a: Decoupled Router Support:

  - Created decoupled-router-client package
  - Created decoupled-router-client-example
  - Added translatePath method in decoupled-router-client - sources a response from decoupled-router endpoint
  - Added instance of DecoupledRouterClass as property on JsonApiClient
  - Added getResourceByPath method to JsonApiClient
  - Moved getCachedResponse to base class
  - Ensured features like caching, locale, etc. are supported by getResourceByPath method and passed down to DecoupledRouterClient instance.

## 0.4.0

### Minor Changes

- dbec6a2: Adds OAuth2 as an option for authentication

  To use the new option, set the authentication object with the type "OAuth" and provide the client ID and client secret as credentials:

  ```ts
  const baseUrl = "https://example.com";
  const client = new ApiClient(baseUrl, {
    authentication: {
      type: "OAuth",
      credentials: {
        clientId: "my-client-id",
        clientSecret: "my-client-secret",
      },
    },
    // ...
  });
  ```

- a019046: Refactored the return type of the ApiClient fetch to return an object with the response and an error. This allows for some initial error handling in the methods that use fetch.
- c1b0c4a: Adds support for custom authorization header

### Patch Changes

- 806cabd: Added GPL-2.0-or-later license

## 0.2.0

### Minor Changes

- 8249d5d: Initial 0.1.0 release under @drupal-api-client namespace
- 865d52d: Use named instead of default exports

## 0.1.0

### Minor Changes

- 269c1e7: Initial 0.1.0 release under @drupal-api-client namespace
