import { protectedProcedure, router } from "../trpc";
import { ZodError, ZodIssue, z } from "zod";
import { FormResult } from "../types/FormResult";
import { StatusCodes } from "http-status-codes";
import { TRPCError } from "@trpc/server";
import { TeacherFormSchema } from "../zodSchemas/TeacherFormSchema";

export const teacherRouter = router({
  getTeachers: protectedProcedure
    .input(
      z
        .object({
          isArchived: z.boolean().default(false).optional(),
          orderBy: z
            .enum(["teacherId", "lastName", "firstName", "nickname"])
            .default("teacherId")
            .optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const isArchived = input?.isArchived ?? false;

      return await ctx.prisma.teacher.findMany({
        where: {
          isArchived: isArchived,
        },
        orderBy: {
          [input?.orderBy ?? "teacherId"]: "asc",
        },
      });
    }),

  getTeacher: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const teacherId = BigInt(input);

      const existingTeacher = ctx.prisma.teacher.findFirst({
        where: {
          teacherId: teacherId,
        },
      });

      if (!existingTeacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Teacher not found anymore",
        });
      }

      return existingTeacher;
    }),

  saveTeacher: protectedProcedure
    .input(TeacherFormSchema)
    .mutation(async ({ input, ctx }) => {
      var errors: ZodIssue[] = [];

      const existingNickname = await ctx.prisma.teacher.findFirst({
        where: {
          nickname: {
            equals: input.nickname,
            mode: "insensitive",
          },
          isArchived: false,
          NOT:
            input.id != undefined
              ? {
                  teacherId: input.id,
                }
              : undefined,
        },
      });
      if (existingNickname) {
        errors.push({
          code: "custom",
          path: ["name"],
          message: "Nickname already exists",
        });
      }

      if (errors.length > 0) {
        console.log("errors");
        console.log(errors);
        throw new ZodError(errors);
      }

      if (input.id == undefined) {
        await ctx.prisma.teacher.create({
          data: {
            firstName: input.firstName,
            middleName: input.middleName,
            lastName: input.lastName,
            nameSuffix: input.nameSuffix,
            nickname: input.nickname,
            shortHonorific: input.shortHonorific,
            sex: input.sex,
            isArchived: false,
          },
        });
      } else {
        await ctx.prisma.teacher.update({
          where: {
            teacherId: input.id,
          },
          data: {
            firstName: input.firstName,
            middleName: input.middleName,
            lastName: input.lastName,
            nameSuffix: input.nameSuffix,
            nickname: input.nickname,
            shortHonorific: input.shortHonorific,
            sex: input.sex,
          },
        });
      }

      var success: FormResult = {
        status: StatusCodes.OK,
        title: `Teacher ${
          input.id == undefined ? "added" : "updated"
        } successfully`,
      };

      return success;
    }),

  toggleTeachers: protectedProcedure
    .input(
      z.object({
        teacherIds: z.array(z.string()),
        isArchived: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const togglingTeacherIds = input.teacherIds.map((id) => BigInt(id));
      const togglingTeachers = await ctx.prisma.teacher.findMany({
        where: {
          teacherId: { in: togglingTeacherIds },
        },
      });

      if (togglingTeachers.length == 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Teachers don't exist",
        });
      }

      const result = await ctx.prisma.teacher.updateMany({
        where: {
          teacherId: { in: togglingTeacherIds },
        },
        data: {
          isArchived: input.isArchived,
        },
      });

      var title = "";
      var message = "";

      if (togglingTeacherIds.length == 1) {
        title = `Teacher ${
          input.isArchived ? "archived" : "unarchived"
        } successfully`;
      } else {
        title =
          result.count == togglingTeacherIds.length
            ? `All selected ${result.count} taechers ${
                input.isArchived ? "archived" : "unarchived"
              } successfully`
            : `${result.count} subjects ${
                input.isArchived ? "archived" : "unarchived"
              }`;
        if (togglingTeacherIds.length != result.count) {
          message = `${
            togglingTeacherIds.length - result.count
          } teachers cannot be ${input.isArchived ? "archived" : "unarchived"}`;
        }
      }

      var success: FormResult = {
        status: StatusCodes.OK,
        title,
        message,
      };

      return success;
    }),
});
