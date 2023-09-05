/* eslint-disable @typescript-eslint/no-unused-vars */
import customFetch from "isomorphic-fetch";
import ApiClient from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client.poc";

test("is able to be set to a valid fetch function", () => {
  const client = new ApiClient(baseUrl, { customFetch });
  expect(client.customFetch).toBeDefined();
});

test("should be used when fetch is called", async () => {
  const headers = new Headers();
  headers.set("x-my-custom-fetch-header", "test");
  const customOptions = {
    fetch: (input: RequestInfo | URL, _init?: RequestInit) =>
      customFetch(`${input}?test=true`, {
        headers,
      }),
  };
  const client = new ApiClient(baseUrl, { customFetch: customOptions.fetch });
  const fetchSpy = vi.spyOn(client, "fetch");
  // @ts-ignore
  const customFetchSpy = vi.spyOn(client, "customFetch");

  const res = await client.fetch(`${baseUrl}/test-custom-fetch`);

  expect(fetchSpy).toHaveBeenCalledOnce();
  expect(customFetchSpy).toHaveBeenCalledOnce();
  expect(res.status).toBe(200);
  expect(res.headers.get("x-my-custom-fetch-header")).toEqual("test");
});

test("should use fetch when no customFetch is supplied", async () => {
  const client = new ApiClient(baseUrl);
  const customFetchSpy = vi.spyOn(client, "fetch");
  const requestInit = {
    headers: { "x-my-header": "test" },
  };

  const res = await client
    .fetch(`${baseUrl}/test-custom-fetch`, requestInit)
    .catch();

  expect(customFetchSpy).toHaveBeenCalledOnce();
  expect(customFetchSpy).toHaveBeenLastCalledWith(
    `${baseUrl}/test-custom-fetch`,
    requestInit,
  );
  expect(await res.json()).toBe(null);
});
