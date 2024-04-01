/**
 * @file
 * Api client example behaviors.
 */

import { JsonApiClient } from "https://esm.run/@drupal-api-client/json-api-client";

const client = new JsonApiClient(window.location.origin);

const actions = await client.getCollection("action--action");

console.log("This request requires authentication", actions);
