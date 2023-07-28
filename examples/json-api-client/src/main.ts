import { JsonApiClient } from "@drupal/json-api-client";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const customFetch = (input: RequestInfo, init?: RequestInit) => {
  console.log("Using custom fetch");
  return fetch(input, init).then((response) => {
    return response;
  });
};

async function main() {
  const jsonApiClient = new JsonApiClient(baseUrl, { customFetch });
  const collection = await jsonApiClient.getCollection("node--recipe");
  console.log("JSON:API Collection", collection);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <pre>${JSON.stringify(collection, null, 2)}</pre>
`;
}

main();
