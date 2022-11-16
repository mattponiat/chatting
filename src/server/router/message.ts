import { createRouter } from "./context";
import { z } from "zod";
import { pusher } from "../common/pusher";

export const messageRouter = createRouter()
  .mutation("send", {
    input: z.object({
      text: z
        .string()
        .min(1, "Message can't be empty")
        .max(500, "Message can't be longer than 500 characters"),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) throw new Error("Not logged in");
      const message = await ctx.prisma.message.create({
        data: {
          content: input.text,
          authorId: ctx.session.user.id,
        },
        include: {
          author: true,
        },
      });

      pusher.trigger("chat", "message", message);

      return message;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany({
        include: { author: true },
      });
    },
  });
