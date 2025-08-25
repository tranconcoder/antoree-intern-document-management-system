export enum RequestSource {
  Body = "body",
  Query = "query",
  Params = "params",
}

export const REQUEST_SOURCES = Object.values(RequestSource) as RequestSource[];
