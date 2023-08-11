import { protectedProcedure, router } from "../trpc";

export const seniorHighTrackRouter = router({
  getSeniorHighTracks: protectedProcedure.query(async ({ ctx }) => {
    // const isArchived = input?.isArchived ?? false;

    return await ctx.prisma.seniorHighTrack.findMany({
      orderBy: {
        seniorHighTrackId: "asc",
      },
    });
  }),
});
