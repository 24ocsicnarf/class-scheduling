import { SubjectFormSchema } from "./../zodSchemas";
import { protectedProcedure, router } from "../trpc";
import { ZodError, ZodIssue, z } from "zod";
import { FormResult } from "../types/FormResult";
import { StatusCodes } from "http-status-codes";
import { TRPCError } from "@trpc/server";

export const subjectRouter = router({
  getSubjects: protectedProcedure
    .input(
      z
        .object({
          isArchived: z.boolean().default(false),
          // page: z.number().default(1),
          // limit: z.number().default(10),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const isArchived = input?.isArchived ?? false;

      return await ctx.prisma.subject.findMany({
        where: {
          isArchived: isArchived,
        },
        include: {
          subjectCategory: {
            select: {
              subjectCategoryName: true,
            },
          },
        },
        orderBy: {
          subjectId: "asc",
        },
        // skip: (input.page - 1) * input.limit,
        // take: input.limit,
      });
    }),

  getSubject: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const subjectId = BigInt(input);

      const existingSubject = ctx.prisma.subject.findFirst({
        where: {
          subjectId: subjectId,
        },
        include: {
          subjectCategory: {
            select: {
              subjectCategoryName: true,
            },
          },
        },
      });

      if (!existingSubject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject not found anymore",
        });
      }

      return existingSubject;
    }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subjectCategory.findMany();
  }),

  saveSubject: protectedProcedure
    .input(SubjectFormSchema)
    .mutation(async ({ input, ctx }) => {
      const cleanName = input.subjectName.trim();
      const cleanShortName = input.subjectShortName.trim();
      const cleanColorHex = input.colorHex.trim();

      var errors: ZodIssue[] = [];

      const existingSubjectName = await ctx.prisma.subject.findFirst({
        where: {
          subjectName: {
            equals: cleanName,
            mode: "insensitive",
          },
          NOT:
            input.id != undefined
              ? {
                  subjectId: input.id,
                }
              : undefined,
        },
      });
      if (existingSubjectName) {
        errors.push({
          code: "custom",
          path: ["name"],
          message: "Subject name already exists",
        });
      }

      const existingSubjectCommonName = await ctx.prisma.subject.findFirst({
        where: {
          subjectShortName: {
            equals: cleanShortName,
            mode: "insensitive",
          },
          NOT:
            input.id != undefined
              ? {
                  subjectId: input.id,
                }
              : undefined,
        },
      });
      if (existingSubjectCommonName) {
        errors.push({
          code: "custom",
          path: ["commonName"],
          message: "Common name of the subject already exists",
        });
      }

      // TODO: CHECK IF COLOR IS ALREADY USED

      if (errors.length > 0) {
        console.log("errors");
        console.log(errors);
        throw new ZodError(errors);
      }

      if (input.id == undefined) {
        await ctx.prisma.subject.create({
          data: {
            subjectName: cleanName,
            subjectShortName: cleanShortName,
            colorHex: cleanColorHex,
            isArchived: false,
            subjectCategoryId: input.subjectCategoryId,
          },
        });

        var success: FormResult = {
          status: StatusCodes.OK,
          title: `Subject added successfully`,
        };

        return success;
      } else {
        await ctx.prisma.subject.update({
          where: {
            subjectId: input.id,
          },
          data: {
            subjectName: cleanName,
            subjectShortName: cleanShortName,
            colorHex: cleanColorHex,
            subjectCategoryId: input.subjectCategoryId,
          },
        });

        var success: FormResult = {
          status: StatusCodes.OK,
          title: `Subject updated successfully`,
        };

        return success;
      }
    }),

  toggleSubjects: protectedProcedure
    .input(
      z.object({
        subjectIds: z.array(z.string()),
        isArchived: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const togglingSubjectIds = input.subjectIds.map((id) => BigInt(id));
      const togglingSubjects = await ctx.prisma.subject.findMany({
        where: {
          subjectId: { in: togglingSubjectIds },
        },
      });

      if (togglingSubjects.length == 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Subjects don't exist",
        });
      }

      const result = await ctx.prisma.subject.updateMany({
        where: {
          subjectId: { in: togglingSubjectIds },
        },
        data: {
          isArchived: input.isArchived,
        },
      });

      var title = "";
      var message = "";

      if (togglingSubjectIds.length == 1) {
        title = `Subject ${
          input.isArchived ? "archived" : "unarchived"
        } successfully`;
      } else {
        title =
          result.count == togglingSubjectIds.length
            ? `All selected ${result.count} subjects ${
                input.isArchived ? "archived" : "unarchived"
              } successfully`
            : `${result.count} subjects ${
                input.isArchived ? "archived" : "unarchived"
              }`;
        if (togglingSubjectIds.length != result.count) {
          message = `${
            togglingSubjectIds.length - result.count
          } subjects cannot be ${input.isArchived ? "archived" : "unarchived"}`;
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
