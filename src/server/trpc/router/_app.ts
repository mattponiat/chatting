import { router } from "src/server/trpc/trpc";
import { userRouter } from "src/server/trpc/router/user";
import { messageRouter } from "src/server/trpc/router/message";

export const appRouter = router({
  message: messageRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
