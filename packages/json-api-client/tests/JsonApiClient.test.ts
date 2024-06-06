import { Sha256 } from "@aws-crypto/sha256-js";
import { toHex } from "@smithy/util-hex-encoding";
import { JsonApiClient } from "../src/JsonApiClient";

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

describe("getEntityTypeAndBundleId", () => {
  it("should correctly split a standard resource type", async () => {
    const resourceType = "node--page";

    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(resourceType);

    expect(entityTypeId).toEqual("node");
    expect(bundleId).toEqual("page");
  });

  it("should correctly split a resource type that does not have a bundleId", async () => {
    const resourceType = "customresourcetype";

    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(resourceType);

    expect(entityTypeId).toEqual("customresourcetype");
    expect(bundleId).toEqual("");
  });
});

describe("getCacheKey", () => {
  it("should return the custom cacheKey if it is supplied", async () => {
    const customCacheKey = "customCacheKey";

    const result = await JsonApiClient.createCacheKey({
      cacheKey: customCacheKey,
    });

    expect(result).toEqual(customCacheKey);
  });
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

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      localeSegment,
      queryString,
    });

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key correctly without optional parameters", async () => {
    const entityTypeId = "entityType";

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
    });

    expect(result).toEqual(entityTypeId);
  });

  it("should generate the cache key correctly with entityType and bundleId", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";

    const expectedKey = `${entityTypeId}--${bundleId}`;

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
    });

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key with only localeSegment", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";
    const localeSegment = "en-US";

    const expectedKey = `en-US--${entityTypeId}--${bundleId}`;

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      localeSegment,
    });

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

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      queryString,
    });

    expect(result).toEqual(expectedKey);
  });

  it("should generate the cache key with resourceId", async () => {
    const entityTypeId = "entityType";
    const bundleId = "bundleId";
    const resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";

    const expectedKey = `${entityTypeId}--${bundleId}--${resourceId}`;

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      resourceId,
    });

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

    const result = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      localeSegment,
      queryString,
    });

    expect(result).toEqual(expectedKey);
  });
});

it("should generate the cache key with localeSegment, resourceId and queryString", async () => {
  const entityTypeId = "entityType";
  const bundleId = "bundleId";
  const localeSegment = "en-US";
  const resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";
  const queryString = "param1=value1&param2=value2";

  const hash = new Sha256();
  hash.update(queryString);
  const hashResult = await hash.digest();
  const hashResultHex = toHex(hashResult);

  const expectedKey = `en-US--${entityTypeId}--${bundleId}--${resourceId}--${hashResultHex}`;

  const result = await JsonApiClient.createCacheKey({
    entityTypeId,
    bundleId,
    localeSegment,
    resourceId,
    queryString,
  });

  expect(result).toEqual(expectedKey);
});
