import { createCache } from "../src";
import { JsonApiClient } from "../src/JsonApiClient";
import mockDataViewsArticlePageCustomPath from "./mocks/data/views-article-page-1--custom-path-prefix.json";
import mockDataViewsArticlePage from "./mocks/data/views-article-page-1--default.json";
import mockDataViewsArticlePageLocaleEs from "./mocks/data/views-article-page-1--locale-es.json";

import mockDataViewsArticlePageFiltered from "./mocks/data/views-article-page-1--filtered.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

describe("JsonApiClient.getView()", () => {
  it("should fetch a Drupal View data for a given view id", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "article--page_1";
    const result = await apiClient.getView(type);
    expect(result).toEqual(mockDataViewsArticlePage);
  });

  it("should throw an error when trying to fetch url that doesn't exists", async () => {
    // The test relies on mocking library "msw" borking when
    // routes that is not configured/defined in msw is encountered.
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const type = "article--route_that_does_not_exists";
    let noErrorDetectedFlag = false;
    try {
      await apiClient.getView(type);
    } catch (error) {
      noErrorDetectedFlag = true;
    } finally {
      expect(noErrorDetectedFlag).toBe(true);
    }
  });

  it("should support options for apiPrefix", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      apiPrefix: "custom_api_prefix",
    });
    const type = "article--page_1";
    const result = await apiClient.getView(type);
    expect(result).toEqual(mockDataViewsArticlePageCustomPath);
  });

  it("should support options for locale", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "article--page_1";
    const result = await apiClient.getView(type, { locale: "es" });
    expect(result).toEqual(mockDataViewsArticlePageLocaleEs);
  });

  it("should support options for rawResponse", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "article--page_1";
    const result = await apiClient.getView(type, { rawResponse: true });
    // Even thought result.response and result.json are valid keys
    // tsc, doesn't know about them and we silence the error in test
    // for this reason.
    // @ts-ignore
    expect(result.response).instanceOf(Response);
    // @ts-ignore
    expect(result.json).toEqual(mockDataViewsArticlePage);
  });

  it("should support options for disableCache", async () => {
    // For this test, we create a mock route that would
    // give back slightly different results on each call.
    // Then we peform some calls with cache turned on and off
    // to check expected behaviour.
    const apiClient = new JsonApiClient(baseUrl, { cache: createCache() });
    const type = "article--dynamic";
    const result1 = await apiClient.getView(type, { disableCache: false });
    const result2 = await apiClient.getView(type, { disableCache: false });
    const result3 = await apiClient.getView(type, { disableCache: true });
    const result4 = await apiClient.getView(type, { disableCache: true });
    const result5 = await apiClient.getView(type, { disableCache: false });
    const result6 = await apiClient.getView(type, { disableCache: false });

    // First two calls witch cache turned "on" should match.
    expect(result1).toEqual(result2);
    // After disabling cache, then fresh response won't be same as previous one.
    expect(result2).not.toEqual(result3);
    // Doing another request with cache still turned off, would get us a new page.
    expect(result3).not.toEqual(result4);
    // Turning on cache, would give us a result from previous response,
    // Thus it should be same as first fetch where cache was used.
    // This is because disabling cache, doesn't "clear" any cache.
    expect(result4).not.toEqual(result5);
    expect(result5).toEqual(result1);
    expect(result5).toEqual(result6);
  });

  it("should support options for disableAuthentication", async () => {
    // This test is doing so many mocks that the
    // reliability of this test is questionable.
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const type = "article--page_requires_authentication";
    let noErrorDetectedFlag = false;
    try {
      await apiClient.getView(type, {
        disableAuthentication: true,
      });
    } catch (error) {
      noErrorDetectedFlag = true;
    } finally {
      expect(noErrorDetectedFlag).toBe(true);
    }
  });

  it("should support option for cacheKey", async () => {
    const customCacheKey = "custom-cache-key-for-getView-test";
    const apiClient = new JsonApiClient(baseUrl, { cache: createCache() });
    const type = "article--page_1";
    const result = await apiClient.getView(type, { cacheKey: customCacheKey });
    expect(result).toEqual(mockDataViewsArticlePage);
    const result2 = await apiClient.getCachedResponse(customCacheKey);
    expect(result2).toEqual(mockDataViewsArticlePage);
  });

  it("should support option for queryString", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const type = "article--page_1";
    const result = await apiClient.getView(type, {
      queryString: "filter[title][value]=My%20recipe",
    });
    expect(result).toEqual(mockDataViewsArticlePageFiltered);
  });

  it("view cache keys should be namespaced by default", async () => {
    const key = await JsonApiClient.createCacheKey({
      viewName: "article",
    });
    expect(key).toBe("view--article");
  });
});
