import { ApiClientOptions } from "@drupal/api-client";

export type JsonApiClientOptions = ApiClientOptions & { debug?: boolean };

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type JsonApiParams = Record<string, any>;
