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
import { LoggedUserPasswordFormSchema } from "../zodSchemas/LoggedUserPasswordFormSchema";
import { z } from "zod";

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

  verify: protectedProcedure.query(({ ctx }) => {
    console.log("ctx.userId", ctx.userId);
    return ctx.userId;
  }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.appUser.findMany();
  }),

  getActiveUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.appUser.findMany({
      where: {
        userStatus: UserStatus.active,
      },
      include: {
        appUserRoles: {
          include: {
            appRole: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }),

  getUserRoles: protectedProcedure.query(async ({ ctx }) => {
    const userRole = await ctx.prisma.appUserRole.findFirst({
      where: {
        appUserId: BigInt(ctx.userId),
      },
    });

    return await ctx.prisma.appRole.findMany(
      userRole?.appRoleId == 1
        ? undefined
        : {
            where: {
              appRoleId: {
                not: 1,
              },
            },
          }
    );
  }),

  addUser: protectedProcedure
    .input(UserFormSchema)
    .mutation(async ({ input, ctx }) => {
      const cleanUsername = input.username.trim();

      const existingUser = await ctx.prisma.appUser.findFirst({
        where: {
          username: cleanUsername,
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
          username: cleanUsername,
          passwordHash: hashedPassword,
        },
      });

      return {
        status: 201,
        message: `Account '${cleanUsername}' created successfully`,
      };
    }),

  changeLoggedUserPassword: protectedProcedure
    .input(LoggedUserPasswordFormSchema)
    .mutation(async ({ input, ctx }) => {
      const loggedUser = await ctx.prisma.appUser.findFirst({
        where: {
          appUserId: ctx.userId,
        },
      });

      if (!loggedUser) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Logged user doesn't exist",
        });
      }

      const hashedCurrentPassword = await hashPassword(input.currentPassword);
      if (loggedUser.passwordHash != hashedCurrentPassword) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password invalid",
        });
      }

      const hashedPassword = await hashPassword(input.newPassword);
      await ctx.prisma.appUser.update({
        where: {
          appUserId: ctx.userId,
        },
        data: {
          passwordHash: hashedPassword,
        },
      });

      return {
        status: 200,
        message: `Password changed successfully`,
      };
    }),

  deactivateUser: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const deactivatingUserId = BigInt(input);
      const deactivatingUser = await ctx.prisma.appUser.findFirst({
        where: {
          appUserId: deactivatingUserId,
        },
      });

      if (!deactivatingUser) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Deactivating user doesn't exist",
        });
      }

      await ctx.prisma.appUser.update({
        where: {
          appUserId: deactivatingUserId,
        },
        data: {
          userStatus: UserStatus.inactive,
        },
      });

      return {
        status: 200,
        message: `'${deactivatingUser.username}' deactivated :(`,
      };
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
