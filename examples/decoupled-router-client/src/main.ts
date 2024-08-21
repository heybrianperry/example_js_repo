import { Cache } from "@drupal-api-client/api-client";
import { DecoupledRouterClient } from "@drupal-api-client/decoupled-router-client";

const baseUrl = import.meta.env.VITE_BASE_URL
  ? import.meta.env.VITE_BASE_URL
  : "https://drupal-api-demo.party";

// use sessionStorage for the cache.
const cache = {
  get: async <T>(key: string, _ttl: number) => {
    //                        ^define arbitrary arguments as needed
    console.log(`Checking cache for ${key}...`);
    // parse the JSON here so when we stringify it later it is not double stringified
    return JSON.parse(sessionStorage.getItem(key) as string) as T;
  },
  set: async <T>(key: string, value: T) => {
    console.log(`Setting ${key} in cache...`);
    sessionStorage.setItem(key, JSON.stringify(value));
    return;
  },
} satisfies Cache;

async function main() {
  const decoupledRouterClient = new DecoupledRouterClient(baseUrl, {
    debug: true,
  });
  const translatedPath = await decoupledRouterClient.translatePath(
    "/articles/give-it-a-go-and-grow-your-own-herbs",
  );

  const decoupledRouterClientCached = new DecoupledRouterClient(baseUrl, {
    debug: true,
    cache,
  });
  const cachedPath = await decoupledRouterClientCached.translatePath(
    "/articles/give-your-oatmeal-the-ultimate-makeover",
  );
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <pre>${JSON.stringify(translatedPath, null, 2)}</pre>
    <pre>${JSON.stringify(cachedPath, null, 2)}</pre>`;
}

main();
