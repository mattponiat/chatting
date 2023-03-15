import { z } from "zod";
import { pusher } from "src/server/common/pusher";
import { publicProcedure, router } from "src/server/trpc/trpc";

export const messageRouter = router({
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
