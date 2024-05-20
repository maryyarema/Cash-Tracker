import 'dotenv/config'
import Koa from "koa";
import Router from "koa-router";
import koaBody, { HttpMethodEnum } from "koa-body";
import logger from "koa-logger";
import json from "koa-json";
import cors from "@koa/cors";
import localLogger, { koaLogger } from "./utils/logger";
import { startRoutes } from "./routes";

const port = process.env.PORT
const app = new Koa();
const router = new Router();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(json());
app.use(logger(koaLogger));
app.use(
  koaBody({
    multipart: true,
    parsedMethods: [
      HttpMethodEnum.POST,
      HttpMethodEnum.PUT,
      HttpMethodEnum.PATCH,
      HttpMethodEnum.DELETE,
      HttpMethodEnum.GET,
    ],
  })
);

app.use(startRoutes(router).routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  localLogger.debug(`Koa started on ${port} on ${new Date().toUTCString()}`);
});
