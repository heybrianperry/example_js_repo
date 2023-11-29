import { Cache } from "@drupal-api-client/api-client";
import { JsonApiClient } from "@drupal-api-client/json-api-client";
import { Jsona } from "jsona";
import * as JSONAPI from "jsonapi-typescript";
import { Logger } from "tslog";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  console.log("Using custom fetch");
  return fetch(input, init).then((response) => response);
};

// Collections can be typed in conjunction with the JSONAPI.CollectionResourceDoc type
// from the jsonapi-typescript package.
// this allows us to pass the type into `get` and get back a typed collection.
type Recipe = {
  title: string;
  path: {
    alias: string;
    langcode: string;
  };
  field_cooking_time: number;
  field_difficulty: "easy" | "medium" | "hard";
  field_ingredients: string[];
  field_number_of_servings: number;
  field_preparation_time: number;
  field_recipe_instructions: {
    value: string;
    format: string;
    processed: string;
    field_summary: {
      value: string;
      format: string;
      processed: string;
    };
  };
};

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

// Example of using a custom logging library, in this case tslog.
const customLogger = new Logger({ name: "JsonApiClient" });

async function main() {
  const jsonApiClient = new JsonApiClient(baseUrl, {
    customFetch,
    cache,
    defaultLocale: "en",
    logger: customLogger,
    debug: true,
  });

  const resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";

  const recipeCollection = await jsonApiClient.getCollection<
    JSONAPI.CollectionResourceDoc<string, Recipe>
  >("node--recipe");

  console.log("JSON:API Collection", recipeCollection);

  const collection = await jsonApiClient.getCollection("node--recipe", {
    locale: "es",
  });
  console.log("JSON:API Collection", collection);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <pre>${JSON.stringify(recipeCollection, null, 2)}</pre>`;

  /* Example using a deserializer */
  const jsonApiClientJsona = new JsonApiClient(baseUrl, {
    serializer: new Jsona(),
    debug: true,
  });
  const jsonaCollection = await jsonApiClientJsona.getCollection(
    "node--recipe",
  );
  console.log("JSON:API Collection deserialized via jsona", jsonaCollection);

  /* Example using a default logger */
  const jsonApiClientDefaultLogger = new JsonApiClient(baseUrl, {
    debug: true,
  });
  const defaultLoggerCollection =
    await jsonApiClientDefaultLogger.getCollection("node--recipe");
  console.log(
    "JSON:API Collection with default logger",
    defaultLoggerCollection,
  );

  /* Example using a filter as string */
  const filterCollectionUsingQueryString = await jsonApiClient.getCollection(
    "node--recipe",
    { queryString: "filter[field_cooking_time][value]=60" },
  );
  console.log(
    "JSON:API Collection with filter",
    filterCollectionUsingQueryString,
  );

  /* Example fetching a single resource by ID */
  const singleResource = await jsonApiClient.getResource(
    "node--recipe",
    resourceId,
  );
  console.log("JSON:API Single resource", singleResource);
  const singleResourceSpanish = await jsonApiClient.getResource(
    "node--recipe",
    resourceId,
    {
      locale: "es",
    },
  );
  console.log(
    "JSON:API Single resource overriding default locale",
    singleResourceSpanish,
  );
}

main();
