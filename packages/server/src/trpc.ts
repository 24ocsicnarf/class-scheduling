import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./db/prisma";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import serverConfig from "./config/serverConfig";
import * as jwt from "jsonwebtoken";
import cookie from "cookie";

export function createContextInner() {
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
const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const cookies = cookie.parse(ctx.req.headers.cookie ?? "");
  console.log("cookies", cookies);
  console.log("ctx.req.path", ctx.req.path);

  if (!("token" in cookies)) throw new TRPCError({ code: "UNAUTHORIZED" });

  const cookieToken = cookies["token"];

  if (!cookieToken) throw new TRPCError({ code: "UNAUTHORIZED" });

  const payload = verifyToken(cookieToken);

  return next({
    ctx: {
      userId: payload.userId,
    },
  });
});

interface AccessTokenPayload extends jwt.JwtPayload {
  userId: bigint;
}

export const verifyToken = (token: string) => {
  try {
    const verifiedToken = jwt.verify(
      token,
      serverConfig.secretKey
    ) as AccessTokenPayload;
    return verifiedToken;
  } catch (error) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: error as string,
    });
  }
};

export const protectedProcedure = t.procedure.use(isAuthed);

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
