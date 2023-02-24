import { z } from "zod";
import { router, protectedProcedure } from "src/server/trpc/trpc";

export const userRouter = router({
  changeColor: protectedProcedure
    .input(
      z.object({
        color: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) throw new Error("Not logged in");

      const colors = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { color: input.color },
      });

      return colors;
    }),
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) throw new Error("Not logged in");

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    return user;
  }),
});
