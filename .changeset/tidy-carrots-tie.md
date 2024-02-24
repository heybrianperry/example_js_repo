---
"@drupal-api-client/decoupled-router-client": minor
"@drupal-api-client/json-api-client": minor
"@drupal-api-client/api-client": minor
---

Adds disable authentication option.

- All methods that make fetch requests now accept a 'disableAuthentication' option.
  if 'true' no authorization headers will be added for the related fetch request.
