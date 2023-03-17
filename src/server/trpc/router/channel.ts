import { publicProcedure, router } from "src/server/trpc/trpc";
import { z } from "zod";

export const channelRouter = router({
  create: publicProcedure
    .input(z.object({ channelName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.prisma.channel.create({
        data: {
          id: input.channelName,
        },
      });

      return channel;
    }),
  createRandom: publicProcedure.mutation(async ({ ctx }) => {
    const randomChannel = await ctx.prisma.channel.create({
      data: {},
    });

    return randomChannel;
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allChannels = await ctx.prisma.channel.findMany({});

    return allChannels;
  }),
});
