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
  // use /test-route for any fetch that needs a 200 response
  http.get(
    `${baseUrl}/test-route`,
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
  http.post(`${baseUrl}/oauth/token`, async ({ request }) => {
    const body = new URLSearchParams(await request.text());
    const clientId = body.get("client_id");
    const clientSecret = body.get("client_secret");

    if (clientId !== "test-id" || clientSecret !== "test-secret") {
      return new Response(
        JSON.stringify({
          error: "invalid_client",
          error_description: "The client credentials are invalid",
        }),
        {
          status: 401,
          statusText: "Unauthorized",
          headers: request.headers,
        },
      );
    }
    return new Response(
      JSON.stringify({
        token_type: "Bearer",
        expires_in: 3000,
        access_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQxMmU3ODZiYmQ4ZmQxZmZjNmVjZDRmYWMzZTQ0ZTc1YTNjYzFmMDRiY2E5N2RjMjkzMTEzN2NlN2UwNWQwZTE0OWU3NzUzYWI3ZmUzNDM0In0.eyJhdWQiOiI5YWRjOWM2OS1mYTNiLTRjMjEtOWNlZi1mYmQzNDVkMWEyNjkiLCJqdGkiOiI0MTJlNzg2YmJkOGZkMWZmYzZlY2Q0ZmFjM2U0NGU3NWEzY2MxZjA0YmNhOTdkYzI5MzExMzdjZTdlMDVkMGUxNDllNzc1M2FiN2ZlMzQzNCIsImlhdCI6MTYzNjczNjM2MSwibmJmIjoxNjM2NzM2MzYxLCJleHAiOjE2MzY3MzY2NjEsInN1YiI6IjEiLCJzY29wZXMiOlsiYXV0aGVudGljYXRlZCJdfQ.mwoqLARMWC-zQp6WePu_rZ2M0dTP4tzsML1omsy7hEk0X299C_d_0heVo0czuBo9Jel27bBRSxQW9JVRbbAQNAtMau-yRJjs9cTbOOumY9Lu-P9OeaROzEQLqV9LadRABhLescas7XFdXOyYLVoZLX7wEwSKMrC4ud0wKXYOttU08UO4sU3zmvvPaM0s-G4MA88S2wlPCsu3AloVYNynpsqf-PUPW5th0mJfd5b2VsYtlBQGeAHQLFsfRQmFObbSbYqH79dS6UuRS1nxdntgBDnPersTYid44aaauU4_0_0rLXeaH-0xcUWhBy1SC0d0JcjegUA1t3sCxx8nBRVn0Q",
      }),
      {
        status: 200,
        statusText: "Ok",
        headers: request.headers,
      },
    );
  }),
];
