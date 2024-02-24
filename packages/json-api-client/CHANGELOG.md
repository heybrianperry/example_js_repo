# @drupal-api-client/json-api-client

## 0.7.0

### Minor Changes

- 3da2de9: Adds disable authentication option.

  - All methods that make fetch requests now accept a 'disableAuthentication' option.
    if 'true' no authorization headers will be added for the related fetch request.

### Patch Changes

- Updated dependencies [3da2de9]
  - @drupal-api-client/decoupled-router-client@0.3.0
  - @drupal-api-client/api-client@0.7.0

## 0.6.0

### Minor Changes

- adef533: Update ApiClient Serializer Type to Include serialize method

  - Serializer option now accepts a serialize method. This method
    is not currently used internally, but can be accessed on the
    client to simplify working with deserialized data.

### Patch Changes

- 46a8d8d: createResource, deleteResource and updateResource returns json data by default, but allows raw response support.
- Updated dependencies [adef533]
  - @drupal-api-client/api-client@0.6.0
  - @drupal-api-client/decoupled-router-client@0.2.1

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

### Patch Changes

- Updated dependencies [2285c8a]
  - @drupal-api-client/decoupled-router-client@0.2.0
  - @drupal-api-client/api-client@0.5.0

## 0.4.0

### Minor Changes

- a019046: Refactored the return type of the ApiClient fetch to return an object with the response and an error. This allows for some initial error handling in the methods that use fetch.
- 52e9bce: Adds support for creating resource in json api client.
- 57fd378: Adds support for updating resource in json api client.

### Patch Changes

- 806cabd: Added GPL-2.0-or-later license
- 78f7274: Adds support object as body param for updateResource() and createResource() method
- Updated dependencies [806cabd]
- Updated dependencies [dbec6a2]
- Updated dependencies [a019046]
- Updated dependencies [c1b0c4a]
  - @drupal-api-client/api-client@0.4.0

## 0.3.0

### Minor Changes

- 8c8571b: Introduce `rawResponse` option which will return an object inlcuding json data along with the raw response

### Patch Changes

- 565d710: Adds method to delete resource in jsonapi client.
- b4f9059: Adds options to disable cache while retriving data.

## 0.2.0

### Minor Changes

- 865d52d: Replace the `get` method with `getResource` to fetch an individual resource and `getCollection` to fetch a collection.
- 8249d5d: Initial 0.1.0 release under @drupal-api-client namespace
- 865d52d: Use named instead of default exports

### Patch Changes

- Updated dependencies [8249d5d]
- Updated dependencies [865d52d]
  - @drupal-api-client/api-client@0.2.0

## 0.1.0

### Minor Changes

- 269c1e7: Initial 0.1.0 release under @drupal-api-client namespace

### Patch Changes

- Updated dependencies [269c1e7]
  - @drupal-api-client/api-client@0.1.0
