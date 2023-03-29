import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "src/server/trpc/trpc";
import { z } from "zod";

export const channelRouter = router({
  create: publicProcedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.prisma.channel.create({
        data: {
          id: input.channelId,
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
  getChannelById: publicProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const channel = await ctx.prisma.channel.findUnique({
        where: { id: input.channelId },
      });

      if (!channel)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Channel not found",
        });

      return channel;
    }),
});
