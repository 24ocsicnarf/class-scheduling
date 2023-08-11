import serverConfig from "../config/serverConfig";
import * as jwt from "jsonwebtoken";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { t } from "../t";

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const cookies = cookie.parse(ctx.req.headers.cookie ?? "");
  console.log("cookies", cookies);
  console.log("ctx.req.path", ctx.req.path);

  if (!("token" in cookies)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const cookieToken = cookies["token"];

  if (!cookieToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const payload = verifyToken(cookieToken);

  return next({
    ctx: {
      userId: payload.userId,
      username: payload.username,
    },
  });
});

interface AccessTokenPayload extends jwt.JwtPayload {
  userId: bigint;
  username: string;
}

const verifyToken = (token: string) => {
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
