import { GraphqlClient } from "@drupal-api-client/graphql-client";

const baseUrl = import.meta.env.VITE_BASE_URL
  ? import.meta.env.VITE_BASE_URL
  : "https://drupal-api-demo.party";

async function main() {
  const graphqlClient = new GraphqlClient(baseUrl, {
    authentication: {
      type: "Basic",
      credentials: {
        username: import.meta.env.VITE_USERNAME,
        password: import.meta.env.VITE_PASSWORD,
      },
    },
  });
  const query = await graphqlClient.query(
    `query GetArticles {
      nodeArticles(first: 10) {
        nodes {
          title
        }
      }
    }`,
  );

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <pre>${JSON.stringify(query, null, 2)}</pre>`;
}

main();
