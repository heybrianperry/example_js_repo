import { http } from "msw";
import resolvedArticleEs from "./data/resolved-article-es.json";
import resolvedArticle from "./data/resolved-article.json";
import unresolvedArticle from "./data/unresolved-article.json";

const baseUrl = "https://drupal-contributions.lndo.site";
const apiPrefix = "router/translate-path";

export default [
  http.get(`${baseUrl}/${apiPrefix}`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("path") ===
        "/articles/give-it-a-go-and-grow-your-own-herbs"
    ) {
      return new Response(JSON.stringify(resolvedArticle), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(unresolvedArticle), {
      status: 404,
      statusText: "Not Found",
      headers: request.headers,
    });
  }),
  http.get(`${baseUrl}/es/${apiPrefix}`, ({ request }) => {
    const url = new URL(request.url);
    if (
      url.searchParams &&
      url.searchParams.get("path") ===
        "/articles/prueba-y-cultiva-tus-propias-hierbas"
    ) {
      return new Response(JSON.stringify(resolvedArticleEs), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      });
    }
    return new Response(JSON.stringify(unresolvedArticle), {
      status: 404,
      statusText: "Not Found",
      headers: request.headers,
    });
  }),
];
