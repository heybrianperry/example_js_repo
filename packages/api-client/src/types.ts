export type BaseUrl = string;

export type ApiClientOptions = {
  apiPrefix?: string;
  customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};