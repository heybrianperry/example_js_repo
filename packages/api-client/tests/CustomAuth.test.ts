import { ApiClient } from "../src/ApiClient";

test('addAuthorizationHeader should add Basic authorization header if authentication type is "basic"', async () => {
  // Arrange
  const apiClient = new ApiClient("https://example.com", {
    authentication: {
      type: "Custom",
      credentials: {
        value: "Bearer randomstringcontent",
      },
    },
  });

  const inputOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Act
  const updatedOptions = await apiClient.addAuthorizationHeader(inputOptions);

  // Assert
  expect(updatedOptions.headers).toBeInstanceOf(Headers);
  if (updatedOptions.headers instanceof Headers) {
    expect(updatedOptions.headers.get("Authorization")).toBe(
      "Bearer randomstringcontent",
    );
  }
});
