import customFetch from "isomorphic-fetch";
import { OAuthTokenResponse } from "../src";
import { ApiClient } from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client.poc";

describe("Simple OAuth", async () => {
  it("should fetch the OAuth token from Drupal using client_credentials grant", async () => {
    const apiClient = new ApiClient(baseUrl, {
      authentication: {
        type: "OAuth",
        credentials: {
          clientId: "test-id",
          clientSecret: "test-secret",
        },
      },
    });

    const authHeaderSpy = vi.spyOn(apiClient, "addAuthorizationHeader");
    await apiClient.fetch(`${baseUrl}/test-route`);

    expect(authHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should fetch the OAuth token from Drupal using password grant", async () => {
    const apiClient = new ApiClient(baseUrl, {
      authentication: {
        type: "OAuth",
        credentials: {
          grantType: "password",
          clientId: "test-id",
          clientSecret: "test-secret",
          username: "test-username",
          password: "test-password",
        },
      },
    });

    const authHeaderSpy = vi.spyOn(apiClient, "addAuthorizationHeader");
    await apiClient.fetch(`${baseUrl}/test-route`);

    expect(authHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should fetch the OAuth token from Drupal using custom fetch", async () => {
    const headers = new Headers();
    headers.set("x-my-custom-fetch-header", "test");
    const apiClient = new ApiClient(baseUrl, {
      customFetch: (input: RequestInfo | URL, _init?: RequestInit) =>
        customFetch(`${input}?test=true`, {
          headers,
        }),
      authentication: {
        type: "OAuth",
        credentials: {
          clientId: "test-id",
          clientSecret: "test-secret",
        },
      },
    });

    const authHeaderSpy = vi.spyOn(apiClient, "addAuthorizationHeader");
    await apiClient.fetch(`${baseUrl}/test-route`);

    expect(authHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should use the stored OAuth token if it is still valid", async () => {
    // mocking the ApiClient to get around the protected class for testing
    class MockApiClient extends ApiClient {
      async getAccessToken({
        clientId,
        clientSecret,
      }: {
        clientId: string;
        clientSecret: string;
      }): Promise<OAuthTokenResponse> {
        return super.getAccessToken({ clientId, clientSecret });
      }
    }
    const apiClient = new MockApiClient(baseUrl, {
      debug: true,
      authentication: {
        type: "OAuth",
        credentials: {
          clientId: "test-id",
          clientSecret: "test-secret",
        },
      },
    });

    const getAccessTokenSpy = vi.spyOn(apiClient, "getAccessToken");

    // first fetch gets the token
    await apiClient.fetch(`${baseUrl}/test-route`);
    // second fetch should use the stored token
    await apiClient.fetch(`${baseUrl}/test-route`);

    expect(getAccessTokenSpy).toHaveBeenCalledOnce();
  });
  it("should log a message if debug is true and the auth type is not configured", async () => {
    const apiClient = new ApiClient(baseUrl, {
      debug: true,
      authentication: {
        // @ts-expect-error - intentionally incorrect type
        type: "NotValid",
        credentials: {
          clientId: "test-id",
          clientSecret: "test-secret",
        },
      },
    });

    const logSpy = vi.spyOn(apiClient, "log");

    await apiClient.fetch(`${baseUrl}/test-route`);

    expect(logSpy).toHaveBeenCalledOnce();
  });
  it.fails(
    "should throw an error if the credentials are incorrect - client_credentials grant",
    async () => {
      const apiClient = new ApiClient(baseUrl, {
        authentication: {
          type: "OAuth",
          credentials: {
            clientId: "wrong-id",
            clientSecret: "wrong-secret",
          },
        },
      });
      expect(() => apiClient.fetch(`${baseUrl}/test-route`)).toThrowError(
        "Could not authenticate with the provided credentials.",
      );
    },
  );
  it.fails("should throw an error if the credentials are missing", async () => {
    const apiClient = new ApiClient(baseUrl, {
      authentication: {
        type: "OAuth",
        // @ts-expect-error - intentionally missing credentials
        credentials: {
          clientSecret: "wrong-secret",
        },
      },
    });

    expect(() => apiClient.fetch(`${baseUrl}/test-route`)).toThrowError(
      "credentials.clientId or credentials.clientSecret is missing on the authentication option.",
    );
  });
  it.fails("should throw an error if the credentials are missing", async () => {
    const apiClient = new ApiClient(baseUrl, {
      authentication: {
        type: "OAuth",
        credentials: {
          grantType: "password",
          clientId: "test-id",
          clientSecret: "test-secret",
          password: "test-password",
        },
      },
    });

    expect(() => apiClient.fetch(`${baseUrl}/test-route`)).toThrowError(
      "credentials.clientId or credentials.clientSecret is missing on the authentication option.",
    );
  });
});
