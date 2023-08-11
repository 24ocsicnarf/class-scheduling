import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const yearLevelRouter = router({
  getYearLevels: protectedProcedure
    .input(
      z
        .object({
          isArchived: z.boolean().default(false),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const isArchived = input?.isArchived ?? false;

      return await ctx.prisma.yearLevel.findMany({
        where: {
          isArchived: isArchived,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });
    }),

  // getYearLevel: protectedProcedure
  //   .input(z.number())
  //   .query(async ({ input, ctx }) => {
  //     const yearLevelId = BigInt(input);

  //     const existingYearLevel = ctx.prisma.yearLevel.findFirst({
  //       where: {
  //         yearLevelId: yearLevelId,
  //       },
  //     });

  //     if (!existingYearLevel) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Year level not found anymore",
  //       });
  //     }

  //     return existingYearLevel;
  //   }),

  // saveYearLevel: protectedProcedure
  //   .input(SubjectFormSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     var errors: ZodIssue[] = [];

  //     const existingSubjectName = await ctx.prisma.subject.findFirst({
  //       where: {
  //         name: {
  //           equals: cleanName,
  //           mode: "insensitive",
  //         },
  //         NOT:
  //           input.id != undefined
  //             ? {
  //                 subjectId: input.id,
  //               }
  //             : undefined,
  //       },
  //     });
  //     if (existingSubjectName) {
  //       errors.push({
  //         code: "custom",
  //         path: ["name"],
  //         message: "Subject name already exists",
  //       });
  //     }

  //     const existingSubjectCommonName = await ctx.prisma.subject.findFirst({
  //       where: {
  //         commonName: {
  //           equals: cleanCommonName,
  //           mode: "insensitive",
  //         },
  //         NOT:
  //           input.id != undefined
  //             ? {
  //                 subjectId: input.id,
  //               }
  //             : undefined,
  //       },
  //     });
  //     if (existingSubjectCommonName) {
  //       errors.push({
  //         code: "custom",
  //         path: ["commonName"],
  //         message: "Common name of the subject already exists",
  //       });
  //     }

  //     // TODO: CHECK IF COLOR IS ALREADY USED

  //     if (errors.length > 0) {
  //       console.log("errors");
  //       console.log(errors);
  //       throw new ZodError(errors);
  //     }

  //     if (input.id == undefined) {
  //       await ctx.prisma.subject.create({
  //         data: {
  //           name: cleanName,
  //           commonName: cleanCommonName,
  //           colorHex: cleanColorHex,
  //           isArchived: false,
  //           subjectCategoryId: input.subjectCategoryId,
  //         },
  //       });

  //       var success: FormResult = {
  //         status: StatusCodes.OK,
  //         title: `Subject added successfully`,
  //       };

  //       return success;
  //     } else {
  //       await ctx.prisma.subject.update({
  //         where: {
  //           subjectId: input.id,
  //         },
  //         data: {
  //           name: cleanName,
  //           commonName: cleanCommonName,
  //           colorHex: cleanColorHex,
  //           subjectCategoryId: input.subjectCategoryId,
  //         },
  //       });

  //       var success: FormResult = {
  //         status: StatusCodes.OK,
  //         title: `Subject updated successfully`,
  //       };

  //       return success;
  //     }
  //   }),

  // toggleSubjects: protectedProcedure
  //   .input(
  //     z.object({
  //       subjectIds: z.array(z.string()),
  //       isArchived: z.boolean(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const togglingSubjectIds = input.subjectIds.map((id) => BigInt(id));
  //     const togglingSubjects = await ctx.prisma.subject.findMany({
  //       where: {
  //         subjectId: { in: togglingSubjectIds },
  //       },
  //     });

  //     if (togglingSubjects.length == 0) {
  //       throw new TRPCError({
  //         code: "CONFLICT",
  //         message: "Subjects don't exist",
  //       });
  //     }

  //     const result = await ctx.prisma.subject.updateMany({
  //       where: {
  //         subjectId: { in: togglingSubjectIds },
  //       },
  //       data: {
  //         isArchived: input.isArchived,
  //       },
  //     });

  //     var title = "";
  //     var message = "";

  //     if (togglingSubjectIds.length == 1) {
  //       title = `Subject ${
  //         input.isArchived ? "archived" : "unarchived"
  //       } successfully`;
  //     } else {
  //       title =
  //         result.count == togglingSubjectIds.length
  //           ? `All selected ${result.count} subjects ${
  //               input.isArchived ? "archived" : "unarchived"
  //             } successfully`
  //           : `${result.count} subjects ${
  //               input.isArchived ? "archived" : "unarchived"
  //             }`;
  //       if (togglingSubjectIds.length != result.count) {
  //         message = `${
  //           togglingSubjectIds.length - result.count
  //         } subjects cannot be ${input.isArchived ? "archived" : "unarchived"}`;
  //       }
  //     }

  //     var success: FormResult = {
  //       status: StatusCodes.OK,
  //       title,
  //       message,
  //     };

  //     return success;
  //   }),
});
