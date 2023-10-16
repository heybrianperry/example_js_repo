import { http } from "msw";
import nodePage from "./data/node-page.json";
import nodeRecipe from "./data/node-recipe.json";
import nodePageEnglish from "./data/node-page-en.json";
import nodePageSpanish from "./data/node-page-es.json";
import nodePageFilter from "./data/node-page-filter.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const apiPrefix = "jsonapi";

const defaultLocale = "en";

const overrideLocale = "es";

export default [
  http.get(`${baseUrl}/${apiPrefix}/node/page`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("filter[field_cooking_time][value]") === "30"
    ) {
      return new Response(JSON.stringify(nodePageFilter), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(nodePage), {
      status: 200,
      statusText: "Ok",
      headers: request.headers,
    });
  }),
  http.get(
    `${baseUrl}/${apiPrefix}/node/recipe`,
    ({ request }) =>
      new Response(JSON.stringify(nodeRecipe), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${defaultLocale}/${apiPrefix}/node/page`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageEnglish), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${overrideLocale}/${apiPrefix}/node/page`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageSpanish), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
];
