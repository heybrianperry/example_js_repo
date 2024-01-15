import { http } from "msw";

const baseUrl = "https://dev-drupal-api-client.poc";

export default [
  http.get(
    `${baseUrl}/test-custom-fetch`,
    ({ request }) =>
      new Response(JSON.stringify(null), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
  http.get(
    `${baseUrl}/jsonapi/node/article`,
    ({ request }) =>
      new Response(JSON.stringify(null), {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      }),
  ),
];
