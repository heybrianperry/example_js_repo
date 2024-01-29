---
"@drupal-api-client/api-client": minor
---

Adds OAuth2 as an option for authentication

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
