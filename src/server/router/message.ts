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
