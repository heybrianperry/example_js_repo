---
"@drupal-api-client/json-api-client": minor
"@drupal-api-client/api-client": minor
---

Update ApiClient Serializer Type to Include serialize method

- Serializer option now accepts a serialize method. This method
  is not currently used internally, but can be accessed on the
  client to simplify working with deserialized data.
