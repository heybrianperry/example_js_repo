import { DecoupledRouterResponse } from "decoupled-router-client/dist";
import { DecoupledRouterClient } from "../src/DecoupledRouterClient";
import {
  isRaw,
  isResolved,
  type RawDecoupledRouterResponse,
} from "../src/types";
import resolvedArticleEs from "./mocks/data/resolved-article-es.json";
import resolvedArticle from "./mocks/data/resolved-article.json";
import unresolvedArticle from "./mocks/data/unresolved-article.json";

const baseUrl = "https://drupal-contributions.lndo.site";
const path = "/articles/give-it-a-go-and-grow-your-own-herbs";
const esPath = "/articles/prueba-y-cultiva-tus-propias-hierbas";

describe("DecoupledRouterClient.translatePath()", () => {
  it("should resolve a valid path", async () => {
    const apiClient = new DecoupledRouterClient(baseUrl);
    const result = await apiClient.translatePath(path);
    expect(result).toEqual(resolvedArticle);
    expect(isResolved(result as DecoupledRouterResponse)).toBe(true);
  });
  it("should throw an error if an error occurred in fetch", async () => {
    const client = new DecoupledRouterClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(client, "log");
    const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await client.translatePath(path);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(logSpy.mock.calls[1][1]).toEqual(
        `Failed to translate path. Path: ${path}, Error: Something went wrong`,
      );
      expect(fetchSpy).toHaveBeenCalledOnce();
    }
  });
  it("should provide a message if the path was not matched", async () => {
    const apiClient = new DecoupledRouterClient(baseUrl);
    const result = await apiClient.translatePath("/articles/unresolved-path");
    expect(result).toEqual(unresolvedArticle);
  });

  it("should log a debug message when 'translatePath' method is called", async () => {
    const client = new DecoupledRouterClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(client, "log");
    await await client.translatePath(path);
    expect(logSpy.mock.calls[0][1]).toEqual(
      `Fetching endpoint ${baseUrl}/router/translate-path?path=${path}`,
    );
    expect(logSpy).toHaveBeenCalledOnce();
  });

  test("should fetch raw response", async () => {
    const client = new DecoupledRouterClient(baseUrl, { debug: true });
    const rawResponse = (await client.translatePath(path, {
      rawResponse: true,
    })) as RawDecoupledRouterResponse;
    expect(isRaw(rawResponse as RawDecoupledRouterResponse)).toBe(true);

    const { response, json } = rawResponse;

    // Assert that the json data was fetched correctly
    expect(json).toEqual(resolvedArticle);

    // Check if response is an instance of the Response class
    expect(response instanceof Response).toBe(true);

    // Check the HTTP status code
    expect(response.status).toEqual(200);

    // Check the status text
    expect(response.statusText).toEqual("Ok");

    // Check if headers are present
    expect(response.headers).toBeDefined();

    // Confirm json can be read from response stream
    const rawJson = await response.json();
    expect(rawJson).toEqual(resolvedArticle);
  });
  it("should use default locale if provided", async () => {
    const apiClient = new DecoupledRouterClient(baseUrl, {
      defaultLocale: "es",
    });
    const result = await apiClient.translatePath(esPath);
    expect(result).toEqual(resolvedArticleEs);
  });

  it("should allow overriding locale when calling translatePath", async () => {
    const apiClient = new DecoupledRouterClient(baseUrl);
    const result = await apiClient.translatePath(esPath, {
      locale: "es",
    });
    expect(result).toEqual(resolvedArticleEs);
  });

  it("should use authentication if provided", async () => {
    const client = new DecoupledRouterClient(baseUrl, {
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const addAuthHeaderSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.translatePath(path);
    expect(addAuthHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should not use authentication if disabled", async () => {
    const client = new DecoupledRouterClient(baseUrl, {
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    await client.translatePath(path, { disableAuthentication: true });
    const authSpy = vi.spyOn(client, "addAuthorizationHeader");
    expect(authSpy).toBeCalledTimes(0);
  });
});
