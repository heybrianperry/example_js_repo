import { Cache } from "@drupal/api-client";
import JsonApiClient from "@drupal/json-api-client";
import * as JSONAPI from "jsonapi-typescript";
import Jsona from "jsona";

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
    console.log(`Getting ${key} from cache...`);
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
  const jsonApiClient = new JsonApiClient(baseUrl, {
    customFetch,
    cache,
    defaultLocale: "en",
  });

  const recipeCollection = await jsonApiClient.get<
    JSONAPI.CollectionResourceDoc<string, Recipe>
  >("node--recipe");

  console.log("JSON:API Collection", recipeCollection);

  const collection = await jsonApiClient.get("node--recipe", { locale: "es" });
  console.log("JSON:API Collection", collection);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <pre>${JSON.stringify(recipeCollection, null, 2)}</pre>`;

  /* Example using a deserializer */
  const jsonApiClientJsona = new JsonApiClient(baseUrl, {
    serializer: new Jsona(),
  });
  const jsonaCollection = await jsonApiClientJsona.get("node--recipe");
  console.log("JSON:API Collection deserialized via jsona", jsonaCollection);
}

main();
