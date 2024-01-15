import { errorChecker, isError } from "../src/utils/errorChecker";

describe("errorChecker", () => {
  describe("isError", () => {
    it("returns true if the provided error is an Error object", () => {
      const error = new Error("Test error");
      expect(isError(error)).toBe(true);
    });
    it("returns false if the provided error is not an Error object", () => {
      expect(isError("test")).toBe(false);
      expect(isError(1)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
    });
  });
  describe("errorChecker", () => {
    it("returns the provided error if it is an Error object", () => {
      const error = new Error("Test error");
      expect(errorChecker(error)).toBe(error);
    });
    it('returns a new Error object with the message "Unknown error" if the provided error is not an Error object', () => {
      const error = errorChecker("test");
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Unknown error");
    });
  });
});
