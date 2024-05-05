import { GraphqlClient } from "../src/GraphqlClient";
import getArticles from "./mocks/data/get-articles.json";

const baseUrl = "https://drupal-client.ddev.site";

describe("GraphqlClient Class", () => {
  it("Should create default instance of class with base url only", () => {
    const defaultClient = new GraphqlClient(baseUrl);
    expect(defaultClient).toBeInstanceOf(GraphqlClient);
    expect(defaultClient.baseUrl).toBe(baseUrl);
    expect(defaultClient.fetch).toBeTypeOf("function");
    expect(defaultClient.query).toBeTypeOf("function");
    expect(defaultClient.apiPrefix).toBe("graphql");
  });

  it("Should query for articles", async () => {
    const client = new GraphqlClient(baseUrl);
    const query = await client.query(
      `query GetArticles {
      nodeArticles(first: 10) {
        nodes {
          title
        }
      }
    }`,
    );
    expect(query).toEqual(getArticles);
  });
  it("should throw an error if an error occurred in fetch", async () => {
    const client = new GraphqlClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(client, "log");
    const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await client.query(`notvalidquery`);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledOnce();
    }
  });
});
