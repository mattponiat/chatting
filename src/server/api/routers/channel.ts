import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "src/server/api/trpc";
import { z } from "zod";

export const channelRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        channelId: z
          .string()
          .trim()
          .min(1, "Channel name can't be empty")
          .max(20, "Channel name can't be longer than 20 characters"),
      })
    )
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
  getById: publicProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const uniqueChannel = await ctx.prisma.channel.findUnique({
        where: { id: input.channelId },
      });

      if (!uniqueChannel)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Channel not found",
        });

      return uniqueChannel;
    }),
});
