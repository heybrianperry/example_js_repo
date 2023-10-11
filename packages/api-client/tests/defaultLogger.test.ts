import ApiClient from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

test("The default logging methods are available", () => {
  const client = new ApiClient(baseUrl);

  // the docs for spyOn say 'Creates a spy on a method or getter/setter of an object.'
  // which is what we're trying to do, but having to use 'as never' here makes it
  // feel like we're using this in an unintended way. Provides the right end result though.
  const errorLoggerSpy = vi.spyOn(client.logger, "error" as never);
  client.log("error", "Call error logger");
  expect(errorLoggerSpy).toHaveBeenCalledOnce();

  const warnLoggerSpy = vi.spyOn(client.logger, "warn" as never);
  client.log("warn", "Call warn logger");
  expect(warnLoggerSpy).toHaveBeenCalledOnce();

  const infoLoggerSpy = vi.spyOn(client.logger, "info" as never);
  client.log("info", "Call info logger");
  expect(infoLoggerSpy).toHaveBeenCalledOnce();

  const httpLoggerSpy = vi.spyOn(client.logger, "http" as never);
  client.log("http", "Call http logger");
  expect(httpLoggerSpy).toHaveBeenCalledOnce();

  const verboseLoggerSpy = vi.spyOn(client.logger, "verbose" as never);
  client.log("verbose", "Call verbose logger");
  expect(verboseLoggerSpy).toHaveBeenCalledOnce();

  const debugLoggerSpy = vi.spyOn(client.logger, "debug" as never);
  client.log("debug", "Call debug logger");
  expect(debugLoggerSpy).toHaveBeenCalledOnce();

  const sillyLoggerSpy = vi.spyOn(client.logger, "silly" as never);
  client.log("silly", "Call silly logger");
  expect(sillyLoggerSpy).toHaveBeenCalledOnce();
});
