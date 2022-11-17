import { router } from "../trpc";
import { userRouter } from "../router/user";
import { messageRouter } from "../router/message";

export const appRouter = router({
  message: messageRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
