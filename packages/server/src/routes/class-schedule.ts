import { FormResult } from "../types/FormResult";
import { ClassScheduleFormSchema } from "./../zodSchemas/ClassScheduleFormSchema";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { TRPCError } from "@trpc/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const classScheduleRouter = router({
  getClassSchedules: protectedProcedure
    .input(
      z.object({
        academicTermId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.schoolClass.findMany({
        where: {
          academicTermId: input.academicTermId,
        },
        include: {
          section: {
            select: {
              classSectionName: true,
              seniorHighSection: {
                select: {
                  seniorHighTrack: {
                    select: {
                      seniorHighTrackName: true,
                    },
                  },
                  seniorHighStrand: {
                    select: {
                      seniorHighStrandName: true,
                    },
                  },
                },
              },
              yearLevel: {
                select: {
                  yearLevelShortName: true,
                },
              },
            },
          },
          subject: {
            select: {
              subjectName: true,
              colorHex: true,
            },
          },
          teacher: {
            select: {
              shortHonorific: true,
              lastName: true,
            },
          },
        },
      });
    }),

  getClassSchedule: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.schoolClass.findUnique({
        where: {
          schoolClassId: input,
        },
      });
    }),

  saveClassSchedule: protectedProcedure
    .input(ClassScheduleFormSchema)
    .mutation(async ({ input, ctx }) => {
      const existingTeacherSchedule = await ctx.prisma.schoolClass.findFirst({
        where: {
          teacherId: input.teacherId,
          dayOfWeek: input.dayOfWeek,
          NOT: {
            schoolClassId: input.id,
          },
          OR: [
            {
              startTime: {
                lte: `1970-01-01T${input.startTime}:00+00:00`,
              },
              endTime: {
                gt: `1970-01-01T${input.startTime}:00+00:00`,
              },
            },
            {
              startTime: {
                lt: `1970-01-01T${input.endTime}:00+00:00`,
              },
              endTime: {
                gte: `1970-01-01T${input.endTime}:00+00:00`,
              },
            },
          ],
        },
        include: {
          subject: {
            select: {
              subjectName: true,
            },
          },
          section: {
            select: {
              classSectionName: true,
              seniorHighSection: {
                select: {
                  seniorHighTrack: {
                    select: {
                      seniorHighTrackName: true,
                    },
                  },
                  seniorHighStrand: {
                    select: {
                      seniorHighStrandName: true,
                    },
                  },
                },
              },
              yearLevel: {
                select: {
                  yearLevelShortName: true,
                },
              },
            },
          },
        },
      });
      if (existingTeacherSchedule) {
        const fullSectionName = `${
          existingTeacherSchedule.section.yearLevel.yearLevelShortName
        } ${
          existingTeacherSchedule.section.seniorHighSection?.seniorHighStrand
            ?.seniorHighStrandName ??
          existingTeacherSchedule.section.seniorHighSection?.seniorHighTrack
            .seniorHighTrackName
        }-${existingTeacherSchedule.section.classSectionName}`;
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Teacher is already teaching ${
            existingTeacherSchedule.subject.subjectName
          } for ${fullSectionName} from ${dayjs
            .utc(existingTeacherSchedule.startTime)
            .format("h:mm a")} to ${dayjs
            .utc(existingTeacherSchedule.endTime)
            .format("h:mm a")}`,
        });
      }

      const existingSectionSchedule = await ctx.prisma.schoolClass.findFirst({
        where: {
          sectionId: input.sectionId,
          dayOfWeek: input.dayOfWeek,
          NOT: {
            schoolClassId: input.id,
          },
          OR: [
            {
              startTime: {
                lte: `1970-01-01T${input.startTime}:00+00:00`,
              },
              endTime: {
                gt: `1970-01-01T${input.startTime}:00+00:00`,
              },
            },
            {
              startTime: {
                lt: `1970-01-01T${input.endTime}:00+00:00`,
              },
              endTime: {
                gte: `1970-01-01T${input.endTime}:00+00:00`,
              },
            },
          ],
        },
        include: {
          subject: {
            select: {
              subjectName: true,
            },
          },
          teacher: {
            select: {
              shortHonorific: true,
              lastName: true,
            },
          },
        },
      });
      if (existingSectionSchedule) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${existingSectionSchedule.teacher.shortHonorific} ${
            existingSectionSchedule.teacher.lastName
          } is already teaching the section ${
            existingSectionSchedule.subject.subjectName
          } from ${dayjs
            .utc(existingSectionSchedule.startTime)
            .format("h:mm a")} to ${dayjs
            .utc(existingSectionSchedule.endTime)
            .format("h:mm a")}`,
        });
      }

      // invalid schedule if subject is taught by different teacher in a section
      const existingSubjectTeacher = await ctx.prisma.schoolClass.findFirst({
        where: {
          subjectId: input.subjectId,
          sectionId: input.sectionId,
          NOT: {
            schoolClassId: input.id,
          },
        },
        include: {
          teacher: {
            select: {
              shortHonorific: true,
              lastName: true,
            },
          },
        },
      });
      if (
        existingSubjectTeacher &&
        Number(existingSubjectTeacher!.teacherId) !== input.teacherId
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Subject is already taught in this section by ${existingSubjectTeacher.teacher.shortHonorific} ${existingSubjectTeacher.teacher.lastName}.`,
        });
      }

      const data = {
        academicTermId: input.academicTermId,
        sectionId: input.sectionId,
        subjectId: input.subjectId,
        teacherId: input.teacherId,
        dayOfWeek: input.dayOfWeek,
        startTime: `1970-01-01T${input.startTime}:00+00:00`,
        endTime: `1970-01-01T${input.endTime}:00+00:00`,
      };
      if (input.id === undefined) {
        await ctx.prisma.schoolClass.create({
          data,
        });
      } else {
        await ctx.prisma.schoolClass.update({
          where: {
            schoolClassId: input.id,
          },
          data,
        });
      }

      var success: FormResult = {
        status: StatusCodes.OK,
        title: `Class schedule ${
          input.id === undefined ? "added" : "updated"
        } successfully`,
      };

      return success;
    }),
});
