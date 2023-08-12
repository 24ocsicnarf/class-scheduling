import path from "path";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";

import serverConfig from "./config/serverConfig";
import { createContext } from "./t";
import connectDb from "./db/prisma";
import { appRouter } from "./routes";

import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

dotenv.config({ path: path.join(__dirname, "./.env") });

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: [serverConfig.origin, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = serverConfig.port;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);

  connectDb();
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export { app };
