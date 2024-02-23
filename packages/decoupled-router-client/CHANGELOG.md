# @drupal-api-client/decoupled-router-client

## 0.2.1

### Patch Changes

- Updated dependencies [adef533]
  - @drupal-api-client/api-client@0.6.0

## 0.2.0

### Minor Changes

- 2285c8a: Decoupled Router Support:

  - Created decoupled-router-client package
  - Created decoupled-router-client-example
  - Added translatePath method in decoupled-router-client - sources a response from decoupled-router endpoint
  - Added instance of DecoupledRouterClass as property on JsonApiClient
  - Added getResourceByPath method to JsonApiClient
  - Moved getCachedResponse to base class
  - Ensured features like caching, locale, etc. are supported by getResourceByPath method and passed down to DecoupledRouterClient instance.

### Patch Changes

- Updated dependencies [2285c8a]
  - @drupal-api-client/api-client@0.5.0
