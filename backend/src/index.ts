import path from "node:path";
import process from "node:process";
import cookieParser from "cookie-parser";
import "dotenv/config";
import e, { json, static as serve } from "express";
import cors from "cors";
import helmet from "helmet";
import http from 'http';

import { HOST, PORT, connectToMongo, initializeSocket } from "./lib";
import routes from "./routes";

const api = e();
api.disable("etag");
api.use(cors());
api.use(cookieParser());
api.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

api.use(json({ limit: "5mb" }));
api.use(serve(path.join(process.cwd(), "public")));

api.use(routes);

const server = http.createServer(api);

connectToMongo().then(() => {
  initializeSocket(server);
  api.listen(PORT, HOST, () => console.log(`API listing on port:- ${PORT}`));
});

module.exports = api;
