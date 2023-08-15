import { publicProcedure, protectedProcedure, router } from "../trpc";
import { UserStatus } from "./../types/UserStatus";
import * as trpc from "@trpc/server";
import bcrypt from "bcrypt";
import {
  UserFormSchema,
  LoginFormSchema,
  LoggedUserPasswordFormSchema,
} from "../zodSchemas";
import {} from "../zodSchemas";
import { AppUser } from "@prisma/client";
import serverConfig from "../config/serverConfig";
import * as jwt from "jsonwebtoken";
import { addSeconds } from "date-fns";
import { ZodError, ZodIssue, z } from "zod";

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

      // TODO: Generate a refresh and access token
      // TODO: Send refresh token back as cookie, access token as in-memory
      const accessToken = generateAccessToken(existingUser);

      ctx.res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain:
          process.env.NODE_ENV === "production"
            ? process.env.PRODUCTION_DOMAIN ?? ".localhost"
            : ".localhost",
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
    return { userId: ctx.userId, username: ctx.username };
  }),

  getUsers: protectedProcedure
    .input(z.nativeEnum(UserStatus))
    .query(async ({ input, ctx }) => {
      const userRole = await ctx.prisma.appUserRole.findFirst({
        where: {
          appUserId: BigInt(ctx.userId),
        },
      });

      return await ctx.prisma.appUser.findMany({
        where: {
          userStatus: input,
          isDefault: false,
          appUserRoles:
            userRole?.appRoleId == 1
              ? undefined
              : {
                  none: {
                    appRoleId: 1,
                  },
                },
        },
        include: {
          appUserRoles: {
            select: {
              appRole: {
                select: {
                  appRoleName: true,
                },
              },
            },
          },
        },
      });
    }),

  getAppRoles: protectedProcedure.query(async ({ ctx }) => {
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

      var errors: ZodIssue[] = [];

      const existingUser = await ctx.prisma.appUser.findFirst({
        where: {
          username: cleanUsername,
        },
      });

      if (existingUser) {
        errors.push({
          code: "custom",
          path: ["username"],
          message: "Username already exists",
        });
      }

      if (errors.length > 0) {
        throw new ZodError(errors);
      }

      const hashedPassword = await hashPassword(input.password);
      await ctx.prisma.appUser.create({
        data: {
          username: cleanUsername,
          passwordHash: hashedPassword,
          appUserRoles: {
            create: {
              appRoleId: input.roleId,
            },
          },
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

  deactivateUsers: protectedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ input, ctx }) => {
      const deactivatingUserIds = input.map((id) => BigInt(id));
      const existingUsersCount = await ctx.prisma.appUser.count({
        where: {
          appUserId: { in: deactivatingUserIds },
        },
      });

      if (existingUsersCount == 0) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Users don't exist",
        });
      }

      const result = await ctx.prisma.appUser.updateMany({
        where: {
          appUserId: { in: deactivatingUserIds },
          isDefault: false,
        },
        data: {
          userStatus: UserStatus.inactive,
        },
      });

      var message = "";
      if (existingUsersCount == 1) {
        const existingUser = await ctx.prisma.appUser.findFirst({
          where: {
            appUserId: deactivatingUserIds[0],
          },
        });

        if (!existingUser) {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User does not exist",
          });
        }

        message = `'${existingUser.username}' deactivated :(`;
      } else {
        message =
          existingUsersCount == deactivatingUserIds.length
            ? `All selected ${existingUsersCount} users deactivated :(`
            : `${result.count} users deactivated :( (${
                deactivatingUserIds.length - result.count
              } users cannot be deactivated)`;
      }

      return {
        status: 200,
        message,
      };
    }),

  reactivateUsers: protectedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ input, ctx }) => {
      const reactivatingUserIds = input.map((id) => BigInt(id));

      const existingUsersCount = await ctx.prisma.appUser.count({
        where: {
          appUserId: { in: reactivatingUserIds },
        },
      });

      if (existingUsersCount == 0) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Reactivating users don't exist",
        });
      }

      const result = await ctx.prisma.appUser.updateMany({
        where: {
          appUserId: { in: reactivatingUserIds },
        },
        data: {
          userStatus: UserStatus.active,
        },
      });

      var title = "";
      var message = "";
      if (existingUsersCount == 1) {
        const existingUser = await ctx.prisma.appUser.findFirst({
          where: {
            appUserId: reactivatingUserIds[0],
          },
        });

        if (!existingUser) {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User does not exist",
          });
        }

        title = `'${existingUser.username}' reactivated :D`;
      } else {
        title =
          existingUsersCount == reactivatingUserIds.length
            ? `All selected ${existingUsersCount} users reactivated :D`
            : `${result.count} users reactivated :)`;
        if (reactivatingUserIds.length != result.count) {
          message = `${
            reactivatingUserIds.length - result.count
          } users cannot be reactivated)`;
        }
      }

      return {
        status: 200,
        title,
        message,
      };
    }),
});

export async function hashPassword(password: string) {
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
      username: user.username,
    },
    serverConfig.secretKey,
    {
      expiresIn: serverConfig.accessTokenExpiresInSeconds,
    }
  );
}
