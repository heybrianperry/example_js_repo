---
"@drupal-api-client/decoupled-router-client": minor
"@drupal-api-client/json-api-client": minor
"@drupal-api-client/api-client": minor
---

Decoupled Router Support:

- Created decoupled-router-client package
- Created decoupled-router-client-example
- Added translatePath method in decoupled-router-client - sources a response from decoupled-router endpoint
- Added instance of DecoupledRouterClass as property on JsonApiClient
- Added getResourceByPath method to JsonApiClient
- Moved getCachedResponse to base class
- Ensured features like caching, locale, etc. are supported by getResourceByPath method and passed down to DecoupledRouterClient instance.
