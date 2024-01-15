import { http } from "msw";
import notFound from "./data/404.json";
import nodePageEnglish from "./data/node-page-en.json";
import nodePageSpanish from "./data/node-page-es.json";
import nodePageFilter from "./data/node-page-filter.json";
import nodePage from "./data/node-page.json";
import nodeRecipeSingleResource from "./data/node-recipe-en-single-resource.json";
import nodeRecipeSingleSpanish from "./data/node-recipe-es-single-resource.json";
import nodeRecipe from "./data/node-recipe.json";

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
    `${baseUrl}/${apiPrefix}/node/recipe/35f7cd32-2c54-49f2-8740-0b0ec2ba61f6`,
    ({ request }) =>
      new Response(JSON.stringify(nodeRecipeSingleResource), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/es/${apiPrefix}/node/recipe/35f7cd32-2c54-49f2-8740-0b0ec2ba61f6`,
    ({ request }) =>
      new Response(JSON.stringify(nodeRecipeSingleSpanish), {
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
  http.delete(
    `${baseUrl}/${apiPrefix}/node/page/35f7cd32-2c54-49f2-8740-0b0ec2ba61f6`,
    ({ request }) =>
      new Response(null, {
        status: 204,
        statusText: "No content",
        headers: request.headers,
      }),
  ),
  http.delete(
    `${baseUrl}/${apiPrefix}/node/page/35f7cd32-2c54-49f2-8740-0b0ec2ba61f7`,
    ({ request }) =>
      new Response(null, {
        status: 404,
        statusText: "Not Found",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${apiPrefix}/node/rcipe`,
    ({ request }) =>
      new Response(JSON.stringify(notFound), {
        status: 404,
        statusText: "Not Found",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${apiPrefix}/node/recipe/invalid-uuid`,
    ({ request }) =>
      new Response(JSON.stringify(notFound), {
        status: 404,
        statusText: "Not Found",
        headers: request.headers,
      }),
  ),
];
