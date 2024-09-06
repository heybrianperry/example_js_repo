import { http, HttpResponse } from "msw";
import notFound from "./data/404.json";
import jsonApiIndexEs from "./data/index-es.json";
import jsonApiIndex from "./data/index.json";
import nodePageEnglish from "./data/node-page-en.json";
import nodePageSpanish from "./data/node-page-es.json";
import nodePage from "./data/node-page.json";
import nodeRecipeSingleResource from "./data/node-recipe-en-single-resource.json";
import nodeRecipeSingleSpanish from "./data/node-recipe-es-single-resource.json";
import nodeRecipeFilter from "./data/node-recipe-filter.json";
import nodeRecipe from "./data/node-recipe.json";
import resolvedRecipeEs from "./data/resolved-recipe-es.json";
import resolvedRecipe from "./data/resolved-recipe.json";
import unresolvedRecipe from "./data/unresolved-recipe.json";
import jsonApiViewsArticlePageDynamic from "./data/views-article-dynamic.json";
import jsonApiViewsArticlePageCustomPath from "./data/views-article-page-1--custom-path-prefix.json";
import jsonApiViewsArticlePage from "./data/views-article-page-1--default.json";
import jsonApiViewsArticlePageFiltered from "./data/views-article-page-1--filtered.json";
import jsonApiViewsArticlePageLocaleEs from "./data/views-article-page-1--locale-es.json";

import nodePageUpdateResource200Response from "./data/node-page-update-resource-200-response.json";
import nodePageUpdateResource404Response from "./data/node-page-update-resource-404-response.json";

import nodePageCreate from "./data/node-page-create-response.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const apiPrefix = "jsonapi";
const routerPrefix = "router/translate-path";

const defaultLocale = "en";

const overrideLocale = "es";

export default [
  http.get(
    `${baseUrl}/${apiPrefix}`,
    ({ request }) =>
      new Response(JSON.stringify(jsonApiIndex), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(`${baseUrl}/${apiPrefix}/views/article/page_1`, ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter[title][value]");
    if (filter !== undefined && filter === "My recipe") {
      return new Response(JSON.stringify(jsonApiViewsArticlePageFiltered), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(jsonApiViewsArticlePage), {
      status: 200,
      statusText: "Ok",
      headers: request.headers,
    });
  }),
  http.get(
    `${baseUrl}/${apiPrefix}/views/article/page_requires_authentication`,
    ({ request, cookies }) => {
      if (!cookies.sessionCookieKey) {
        return new HttpResponse(null, { status: 400 });
      } else {
        return new Response(JSON.stringify(jsonApiViewsArticlePage), {
          status: 200,
          statusText: "Ok",
          headers: request.headers,
        });
      }
    },
  ),
  http.get(`${baseUrl}/${apiPrefix}/views/article/dynamic`, ({ request }) => {
    let json = JSON.stringify(jsonApiViewsArticlePageDynamic);
    json = json.replace(
      "DYNAMIC_TITLE_PLACEHOLDER",
      "DYNAMIC_TITLE " + Math.random() * 10000000000,
    );
    return new Response(json, {
      status: 200,
      statusText: "Ok",
      headers: request.headers,
    });
  }),
  http.get(
    `${baseUrl}/${overrideLocale}/${apiPrefix}/views/article/page_1`,
    ({ request }) =>
      new Response(JSON.stringify(jsonApiViewsArticlePageLocaleEs), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/custom_api_prefix/views/article/page_1`,
    ({ request }) =>
      new Response(JSON.stringify(jsonApiViewsArticlePageCustomPath), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${overrideLocale}/${apiPrefix}`,
    ({ request }) =>
      new Response(JSON.stringify(jsonApiIndexEs), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/${apiPrefix}/node/page`,
    ({ request }) =>
      new Response(JSON.stringify(nodePage), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(`${baseUrl}/${apiPrefix}/node/recipe`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("filter[field_cooking_time][value]") === "30"
    ) {
      return new Response(JSON.stringify(nodeRecipeFilter), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(nodeRecipe), {
      status: 200,
      statusText: "Ok",
      headers: request.headers,
    });
  }),
  http.get(`${baseUrl}/en/${apiPrefix}/node/recipe`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("filter[field_cooking_time][value]") === "30"
    ) {
      return new Response(JSON.stringify(nodeRecipeFilter), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(nodeRecipe), {
      status: 200,
      statusText: "Ok",
      headers: request.headers,
    });
  }),
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
    `${baseUrl}/en/${apiPrefix}/node/recipe/35f7cd32-2c54-49f2-8740-0b0ec2ba61f6`,
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
    `${baseUrl}/${overrideLocale}/${apiPrefix}/node/page/35f7cd32-2c54-49f2-8740-0b0ec2ba61f6`,
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
      new Response(JSON.stringify(notFound), {
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
  http.get(`${baseUrl}/${routerPrefix}`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("path") === "/recipes/deep-mediterranean-quiche"
    ) {
      return new Response(JSON.stringify(resolvedRecipe), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(unresolvedRecipe), {
      status: 404,
      statusText: "Not Found",
      headers: request.headers,
    });
  }),
  http.get(`${baseUrl}/${overrideLocale}/${routerPrefix}`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("path") ===
        "path=/recipes/quiche-mediterráneo-profundo"
    ) {
      return new Response(JSON.stringify(resolvedRecipeEs), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(unresolvedRecipe), {
      status: 404,
      statusText: "Not Found",
      headers: request.headers,
    });
  }),
  http.patch(
    `${baseUrl}/${overrideLocale}/${apiPrefix}/node/page/11fc449b-aca0-4b74-bc3b-677da021f1d7`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageUpdateResource200Response), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.patch(
    `${baseUrl}/${apiPrefix}/node/page/11fc449b-aca0-4b74-bc3b-677da021f1d7`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageUpdateResource200Response), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.patch(
    `${baseUrl}/${apiPrefix}/node/page/66fc449b-aca0-4b74-bc3b-677da021f1d9`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageUpdateResource404Response), {
        status: 404,
        statusText: "Not Found",
        headers: request.headers,
      }),
  ),

  http.post(
    `${baseUrl}/${apiPrefix}/node/page`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageCreate), {
        status: 201,
        statusText: "Created",
        headers: request.headers,
      }),
  ),
  http.post(
    `${baseUrl}/${overrideLocale}/${apiPrefix}/node/page`,
    ({ request }) =>
      new Response(JSON.stringify(nodePageCreate), {
        status: 201,
        statusText: "Created",
        headers: request.headers,
      }),
  ),
  http.post(
    `${baseUrl}/${apiPrefix}/node/invalid-bundle`,
    ({ request }) =>
      new Response(JSON.stringify(notFound), {
        status: 404,
        statusText: "Not Found",
        headers: request.headers,
      }),
  ),
];
