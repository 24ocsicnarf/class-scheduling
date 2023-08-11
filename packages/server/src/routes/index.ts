import { router } from "./../trpc";
import { authRouter } from "./auth";
import { classScheduleRouter } from "./class-schedule";
import { dashboardRouter } from "./dashboard";
import { sectionRouter } from "./section";
import { seniorHighStrandRouter } from "./shs-strand";
import { seniorHighTrackRouter } from "./shs-track";
import { subjectRouter } from "./subject";
import { teacherRouter } from "./teacher";
import { yearLevelRouter } from "./year-level";

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  subject: subjectRouter,
  classSchedule: classScheduleRouter,
  classSection: sectionRouter,
  teacher: teacherRouter,
  yearLevel: yearLevelRouter,
  seniorHighTrack: seniorHighTrackRouter,
  seniorHighStrand: seniorHighStrandRouter,
});
