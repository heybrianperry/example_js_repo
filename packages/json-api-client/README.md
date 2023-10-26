# jsonapi-client

This package contains the `JsonApiClient` class which extends the base `ApiClient` class from the `@drupal-api-client/api-client` package. See https://www.drupal.org/project/api_client for more information about this project.

## Installation

```
npm i @drupal-api-client/json-api-client
```

## Usage

```ts
import { JsonApiClient } from "@drupal-api-client/json-api-client";
import NodeCache from "node-cache";
import Jsona from "jsona";

// the baseUrl to fetch data from
const myDrupalUrl = process.env.MY_DRUPAL_SITE || "https://drupal.example.com";

const client = new JsonApiClient(myDrupalUrl, {
  // supply a custom fetch method in order to add  certain headers to each request
  // or any other logic you may need before the fetch call
  customFetch: (input: RequestInfo | URL, init?: RequestInit) => {
    const newHeaders = new Headers(init?.headers);
    newHeaders.set("X-Custom-Header", "my-custom-value");
    const newInit = {
      ...init,
      headers: newHeaders,
    };

    return fetch(input, newInit);
  },
  // the optional cache will cache a request and return the cached data if the request
  // is made again with the same type same data.
  // The default cache includes an interface that must be implemented.
  // Here is an example using the node-cache package. node-cache implements get and set
  // methods so it is compatible with the cache interface.
  // See https://www.npmjs.com/package/node-cache for details on the node-cache package.
  cache: new NodeCache(),
  // the optional authentication object will be used to authenticate requests.
  // Currently Basic auth is supported.
  authentication: {
    type: "Basic",
    // It is recommended to store sensitive information in environment variables that
    // are not checked in to the source code.
    username: process.env.MY_USERNAME,
    password: process.env.MY_SECRET_PASSWORD,
  },
  // The default locale will be in the URL of each request.
  // example: https://drupal.example.com/en/jsonapi/node/article
  defaultLocale: "en",
  // the optional serializer will be used to serialize and deserialize data.
  serializer: new Jsona(),
});
```
