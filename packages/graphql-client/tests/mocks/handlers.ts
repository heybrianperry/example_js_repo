import { HttpResponse, graphql } from "msw";
import getArticles from "./data/get-articles.json";

export default [
  graphql.query("GetArticles", () => HttpResponse.json(getArticles)),
];
