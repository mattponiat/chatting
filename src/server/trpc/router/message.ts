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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          content: input.text,
          authorId: ctx.session?.user?.id,
        },
        include: {
          author: true,
        },
      });
      await pusher.trigger("chat", "message", message);

      return message;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.message.findMany({
      include: { author: true },
    });
  }),
});
