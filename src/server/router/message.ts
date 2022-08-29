import { createRouter } from "./context";
import { z } from "zod";
import { pusher } from "../common/pusher";

export const messageRouter = createRouter()
  .mutation("send", {
    input: z.object({
      text: z.string().min(1),
      author: z.string(),
    }),
    async resolve({ input, ctx }) {
      const message = await ctx.prisma.message.create({
        data: {
          content: input.text,
          author: input.author,
        },
      });

      pusher.trigger("chat", "message", message);

      return message;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany();
    },
  });
