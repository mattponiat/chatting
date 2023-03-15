import { router } from "src/server/trpc/trpc";
import { userRouter } from "src/server/trpc/router/user";
import { messageRouter } from "src/server/trpc/router/message";
import { channelRouter } from "./channel";

export const appRouter = router({
  message: messageRouter,
  user: userRouter,
  channel: channelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
