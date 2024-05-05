import {
  ApiClient,
  type ApiClientOptions,
  type BaseUrl,
} from "@drupal-api-client/api-client";

/**
 * Graphql Client class provides functionality specific to GraphQL servers.
 * @see {@link ApiClientOptions}
 * @see {@link BaseUrl}
 */
export class GraphqlClient extends ApiClient {
  /**
   * Creates a new instance of the GraphqlClient.
   * @param baseUrl - The base URL of the API. {@link BaseUrl}
   * @param options - (Optional) Additional options for configuring the API client. {@link ApiClientOptions}
   */
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix } = options || {};
    this.apiPrefix = apiPrefix || "graphql";
  }

  /**
   * Retrieves data of a specific shape from GraphQL.
   * @param query - a string containing the desired GraphQL Query.
   * @returns A Promise that resolves to the requested JSON data.
   *
   * @example
   * ```ts
   * const query = await graphqlClient.query(
   * `query GetArticles {
   *   nodeArticles(first: 10) {
   *     nodes {
   *       title
   *     }
   *   }
   * }`,
   * );
   * ```
   */
  async query<T>(query: string): Promise<T> {
    const { response, error } = await this.fetch(
      `${this.baseUrl}/${this.apiPrefix}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `${query}` }),
      },
    );

    if (error) {
      if (this.debug) {
        this.log("error", `GraphQL query failed, Error: ${error.message}`);
      }
      throw error;
    }

    const json = (await response.json()) as T;
    return json;
  }
}
