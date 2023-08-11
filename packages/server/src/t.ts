import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { ZodError } from "zod";

import { prisma } from "./db/prisma";

function createContextInner() {
  return {
    prisma,
  };
}

export function createContext(opts: CreateExpressContextOptions) {
  const contextInner = createContextInner();
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
