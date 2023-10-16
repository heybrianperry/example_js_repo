import JsonApiClient from "../src/JsonApiClient";
import { Sha256 } from "@aws-crypto/sha256-js";
import { toHex } from "@smithy/util-hex-encoding";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const apiPrefix = "customprefix";

test("Create default instance of class with base url only", () => {
  const defaultClient = new JsonApiClient(baseUrl);
  expect(defaultClient).toBeInstanceOf(JsonApiClient);
  expect(defaultClient.baseUrl).toBe(baseUrl);
  expect(defaultClient.fetch).toBeTypeOf("function");
  expect(defaultClient.apiPrefix).toBe("jsonapi");
});

test("Create instance of class with api prefix options", () => {
  const optionsClient = new JsonApiClient(baseUrl, { apiPrefix });
  expect(optionsClient).toBeInstanceOf(JsonApiClient);
  expect(optionsClient.baseUrl).toBe(baseUrl);
  expect(optionsClient.fetch).toBeTypeOf("function");
  expect(optionsClient.apiPrefix).toBe(apiPrefix);
});

test("Instance without baseUrl throws error", () => {
  // @ts-ignore
  expect(() => new JsonApiClient()).toThrowError("baseUrl is required");
});

describe("getCacheKey", () => {
  it("should generate the cache key correctly with all optional parameters", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";
    const localeSegment = "en-US";
    const queryString = "param1=value1&param2=value2";

    const hash = new Sha256();
    hash.update(queryString);
    const hashResult = await hash.digest();
    const hashResultHex = toHex(hashResult);

    const expectedKey = `en-US--${entityTypeId}--${bundleId}--${hashResultHex}`;

    const result = await JsonApiClient.getCacheKey(
      entityTypeId,
      bundleId,
      localeSegment,
      queryString,
    );

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key correctly without optional parameters", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";

    const expectedKey = `${entityTypeId}--${bundleId}`;

    const result = await JsonApiClient.getCacheKey(entityTypeId, bundleId);

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key with only localeSegment", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";
    const localeSegment = "en-US";

    const expectedKey = `en-US--${entityTypeId}--${bundleId}`;

    const result = await JsonApiClient.getCacheKey(
      entityTypeId,
      bundleId,
      localeSegment,
    );

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key with only queryString", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";
    const queryString = "param1=value1&param2=value2";

    const hash = new Sha256();
    hash.update(queryString);
    const hashResult = await hash.digest();
    const hashResultHex = toHex(hashResult);

    const expectedKey = `${entityTypeId}--${bundleId}--${hashResultHex}`;

    const result = await JsonApiClient.getCacheKey(
      entityTypeId,
      bundleId,
      undefined,
      queryString,
    );

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key with both localeSegment and queryString", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";
    const localeSegment = "en-US";
    const queryString = "param1=value1&param2=value2";

    const hash = new Sha256();
    hash.update(queryString);
    const hashResult = await hash.digest();
    const hashResultHex = toHex(hashResult);

    const expectedKey = `en-US--${entityTypeId}--${bundleId}--${hashResultHex}`;

    const result = await JsonApiClient.getCacheKey(
      entityTypeId,
      bundleId,
      localeSegment,
      queryString,
    );

    expect(result).toEqual(expectedKey);
  });
});
