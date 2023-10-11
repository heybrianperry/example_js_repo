/* eslint-disable no-console */
export default {
  error(message: string) {
    console.error("[ERROR]: ", message);
  },
  warn(message: string) {
    console.warn("[WARN]: ", message);
  },
  info(message: string) {
    console.info("[INFO]: ", message);
  },
  http(message: string) {
    console.log("[HTTP]: ", message);
  },
  verbose(message: string) {
    console.log("[LOG]: ", message);
  },
  debug(message: string) {
    console.debug("[DEBUG]: ", message);
  },
  silly(message: string) {
    console.log("[SILLY]: ", message);
  },
};
