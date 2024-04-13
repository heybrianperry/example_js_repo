import type { Cache as ApiClientCache } from "@drupal-api-client/api-client";
import { createCache } from "../src/defaultCache";

describe("createCache", () => {
  const cache = createCache();

  it("should satisfy the Cache interface", () => {
    const isCache = (t: unknown): t is ApiClientCache => {
      if (typeof t !== "object" || t === null) {
        return false;
      }
      return (
        "get" in t &&
        typeof t.get === "function" &&
        "set" in t &&
        typeof t.set === "function"
      );
    };

    expect(isCache(cache)).toBe(true);
  });

  it("should store values and retrieve", async () => {
    await cache.set("foo", "bar");
    expect(await cache.get("foo")).toBe("bar");
  });
});
