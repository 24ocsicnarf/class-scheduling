import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const dashboardRouter = router({
  render: protectedProcedure
    .output(
      z.object({
        message: z.string(),
      })
    )
    .query(async () => {
      return { message: "Welcome to Dashboard" };
    }),
});
