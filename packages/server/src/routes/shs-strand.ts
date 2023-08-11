import { protectedProcedure, router } from "../trpc";

export const seniorHighStrandRouter = router({
  getSeniorHighStrands: protectedProcedure.query(async ({ ctx }) => {
    // const isArchived = input?.isArchived ?? false;

    return await ctx.prisma.seniorHighStrand.findMany({
      orderBy: {
        seniorHighStrandId: "asc",
      },
    });
  }),
});
