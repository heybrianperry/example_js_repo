import { http } from "msw";
import nodePage from "./data/node-page.json";
import nodeRecipe from "./data/node-recipe.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const apiPrefix = "jsonapi";

export default [
  http.get(
    `${baseUrl}/${apiPrefix}/node/page`,
    ({ request }) =>
      new Response(JSON.stringify(nodePage), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${apiPrefix}/node/recipe`,
    ({ request }) =>
      new Response(JSON.stringify(nodeRecipe), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
];
