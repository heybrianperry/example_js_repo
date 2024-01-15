---
"@drupal-api-client/json-api-client": minor
"@drupal-api-client/api-client": minor
---

Refactored the return type of the ApiClient fetch to return an object with the response and an error. This allows for some initial error handling in the methods that use fetch.
