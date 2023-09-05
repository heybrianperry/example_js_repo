import JsonApiClient from "@drupal/json-api-client";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  console.log("Using custom fetch");
  return fetch(input, init).then((response) => response);
};

async function main() {
  const jsonApiClient = new JsonApiClient(baseUrl, { customFetch });
  const collection = await jsonApiClient.get("node--recipe");
  console.log("JSON:API Collection", collection);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <pre>${JSON.stringify(collection, null, 2)}</pre>
`;
}

main();
