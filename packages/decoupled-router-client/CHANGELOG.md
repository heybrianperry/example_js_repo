# @drupal-api-client/decoupled-router-client

## 1.1.0

### Minor Changes

- 1830ea4: Changed to MIT license.
- 4aeef42: Allow a custom cache key to be provided.

### Patch Changes

- Updated dependencies [1830ea4]
  - @drupal-api-client/api-client@1.1.0

## 1.0.0

### Major Changes

- 714b7dd: 1.0 release of api-client, decoupled-router-client, and json-api-client

### Patch Changes

- Updated dependencies [714b7dd]
  - @drupal-api-client/api-client@1.0.0

## 0.3.1

### Patch Changes

- e8bcdaf: Target es2020 for bundles.
- Updated dependencies [e8bcdaf]
  - @drupal-api-client/api-client@0.7.2

## 0.3.0

### Minor Changes

- 3da2de9: Adds disable authentication option.

  - All methods that make fetch requests now accept a 'disableAuthentication' option.
    if 'true' no authorization headers will be added for the related fetch request.

### Patch Changes

- Updated dependencies [3da2de9]
  - @drupal-api-client/api-client@0.7.0

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
