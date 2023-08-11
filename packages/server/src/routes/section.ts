import { protectedProcedure, router } from "../trpc";
import { ZodError, ZodIssue, z } from "zod";
import { FormResult } from "../types/FormResult";
import { StatusCodes } from "http-status-codes";
import { SeniorHighSectionFormSchema } from "../zodSchemas/ClassSectionFormSchedule";

export const sectionRouter = router({
  getSeniorHighSections: protectedProcedure
    .input(
      z
        .object({
          isArchived: z.boolean().default(false),
        })
        .optional()
    )
    .query(async ({ ctx }) => {
      // const isArchived = input?.isArchived ?? false;

      return await ctx.prisma.seniorHighSection.findMany({
        include: {
          classSection: {
            select: {
              classSectionName: true,
              yearLevel: {
                select: {
                  yearLevelShortName: true,
                },
              },
            },
          },
          seniorHighStrand: {
            select: {
              seniorHighStrandName: true,
            },
          },
          seniorHighTrack: {
            select: {
              seniorHighTrackName: true,
            },
          },
        },
        orderBy: [
          {
            classSection: {
              yearLevel: {
                yearLevelShortName: "asc",
              },
            },
          },
          {
            seniorHighStrand: { seniorHighStrandName: "asc" },
          },
          {
            seniorHighTrack: { seniorHighTrackName: "asc" },
          },
          {
            classSection: { classSectionName: "asc" },
          },
        ],
      });
    }),

  getSeniorHighSection: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.seniorHighSection.findFirst({
        where: {
          classSectionId: input,
        },
        include: {
          classSection: {
            select: {
              classSectionName: true,
              yearLevel: {
                select: {
                  yearLevelId: true,
                },
              },
            },
          },
        },
      });
    }),

  saveSeniorHighSection: protectedProcedure
    .input(SeniorHighSectionFormSchema)
    .mutation(async ({ input, ctx }) => {
      var errors: ZodIssue[] = [];

      const existingSectionName = await ctx.prisma.classSection.findFirst({
        where: {
          classSectionName: {
            equals: input.classSectionName,
            mode: "insensitive",
          },
          yearLevelId: input.yearLevelId,
          seniorHighSection: {
            seniorHighStrandId: input.seniorHighStrandId,
            seniorHighTrackId: input.seniorHighTrackId,
          },
          NOT:
            input.id != undefined
              ? {
                  classSectionId: input.id,
                }
              : undefined,
        },
      });
      if (existingSectionName) {
        errors.push({
          code: "custom",
          path: ["classSectionName"],
          message: "Section already exists",
        });
      }

      if (errors.length > 0) {
        throw new ZodError(errors);
      }

      if (input.id == undefined) {
        await ctx.prisma.classSection.create({
          data: {
            classSectionName: input.classSectionName,
            yearLevelId: input.yearLevelId,
            seniorHighSection: {
              create: {
                seniorHighStrandId: input.seniorHighStrandId,
                seniorHighTrackId: input.seniorHighTrackId,
              },
            },
          },
        });
      } else {
        await ctx.prisma.classSection.update({
          where: {
            classSectionId: input.id,
          },
          data: {
            classSectionName: input.classSectionName,
            yearLevelId: input.yearLevelId,
            seniorHighSection: {
              update: {
                seniorHighStrandId: input.seniorHighStrandId,
                seniorHighTrackId: input.seniorHighTrackId,
              },
            },
          },
        });
      }

      return {
        status: StatusCodes.OK,
        title: `Subject ${
          input.id == undefined ? "added" : "updated"
        } successfully`,
      } as FormResult;
    }),
});
