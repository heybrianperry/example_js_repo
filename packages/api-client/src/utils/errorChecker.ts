/**
 * Type guard to check if the provided error is an Error object.
 * @param error
 * @returns true if the provided error is an Error object, otherwise false.
 */
export const isError = (arg: unknown): arg is Error => {
  if (
    (arg !== null && arg && typeof arg === "object" && "message" in arg) ||
    arg instanceof Error
  ) {
    return true;
  }
  return false;
};

/**
 * Checks if the provided error is an Error object.
 * @param error - The error to check.
 * @returns The error if it is an Error object, otherwise a new Error object with the message "Unknown error".
 */
export const errorChecker = (error: unknown): Error => {
  if (isError(error)) {
    return error;
  }
  return new Error("Unknown error");
};
