import { z } from "zod";
import { pusher } from "src/server/common/pusher";
import { publicProcedure, createTRPCRouter } from "src/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

// Create a new ratelimiter, that allows 5 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
});

export const messageRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        text: z
          .string()
          .trim()
          .min(1, "Message can't be empty")
          .max(500, "Message can't be longer than 500 characters"),
        channelId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          content: input.text,
          authorId: ctx.session?.user?.id,
          channelId: input.channelId,
        },
        include: {
          author: true,
        },
      });
      const sessionUser = ctx.session?.user?.id || null;

      const { success } = await ratelimit.limit(sessionUser as string);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests!",
        });
      }

      await pusher.trigger(input.channelId, "message", message);

      return message;
    }),
  getAll: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const allMessages = await ctx.prisma.message.findMany({
        where: { channelId: input.channelId },
        include: { author: true },
      });

      return allMessages;
    }),
});
