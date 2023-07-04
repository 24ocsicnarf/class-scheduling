import { publicProcedure, protectedProcedure, router } from "../trpc";
import { UserStatus } from "./../types/UserStatus";
import * as trpc from "@trpc/server";
import bcrypt from "bcrypt";
import { LoginFormSchema } from "../zodSchemas/LoginFormSchema";
import { UserFormSchema } from "../zodSchemas/UserFormSchema";
import { AppUser } from "@prisma/client";
import serverConfig from "../config/serverConfig";
import * as jwt from "jsonwebtoken";
import { addSeconds } from "date-fns";

export const authRouter = router({
  logIn: publicProcedure
    .input(LoginFormSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.appUser.findFirst({
        where: {
          username: input.username,
        },
      });

      if (!existingUser || existingUser.userStatus != UserStatus.active) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const isAuthenticated = await arePasswordsMatched(
        input.password,
        existingUser.passwordHash
      );

      if (!isAuthenticated) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      // Generate a refresh and access token
      // Send refresh token back as cookie, access token as in-memory
      const accessToken = generateAccessToken(existingUser);

      ctx.res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: addSeconds(
          Date.now(),
          serverConfig.accessTokenExpiresInSeconds
        ),
      });

      return {
        userId: existingUser.appUserId,
        username: existingUser.username,
        token: accessToken,
      };
    }),

  logOut: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("token");
  }),

  addUser: protectedProcedure
    .input(UserFormSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.appUser.findFirst({
        where: {
          username: input.username,
        },
      });

      if (existingUser) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashedPassword = await hashPassword(input.password);
      await ctx.prisma.appUser.create({
        data: {
          username: input.username,
          passwordHash: hashedPassword,
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
      };
    }),

  verify: protectedProcedure.query(({ ctx }) => {
    console.log("ctx.userId", ctx.userId);
    return ctx.userId;
  }),
});

async function hashPassword(password: string) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function arePasswordsMatched(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateAccessToken(user: AppUser) {
  return jwt.sign(
    {
      userId: user.appUserId,
    },
    serverConfig.secretKey,
    {
      expiresIn: serverConfig.accessTokenExpiresInSeconds,
    }
  );
}
