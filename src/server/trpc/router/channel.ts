import { publicProcedure, router } from "src/server/trpc/trpc";

export const channelRouter = router({
  create: publicProcedure.mutation(async ({ ctx }) => {
    const channel = await ctx.prisma.channel.create({
      data: {},
    });

    return channel;
  }),
});
