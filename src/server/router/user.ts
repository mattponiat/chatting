import { createRouter } from "./context";
import { z } from "zod";

export const userRouter = createRouter()
  .mutation("changeColor", {
    input: z.object({
      color: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) throw new Error("Not logged in");

      const colors = await ctx.prisma.user.update({
        where: { id: ctx.session?.user?.id },
        data: {
          color: input.color,
        },
      });

      return colors;
    },
  })
  .query("getCurrent", {
    async resolve({ ctx }) {
      if (!ctx.session?.user?.id) throw new Error("Not logged in");

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session?.user?.id },
      });

      return user;
    },
  });
