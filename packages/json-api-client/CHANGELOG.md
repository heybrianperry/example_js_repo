# @drupal-api-client/json-api-client

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
