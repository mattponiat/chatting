import { createTRPCRouter } from "~/server/api/trpc";
import { channelRouter } from "./routers/channel";
import { messageRouter } from "./routers/message";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  message: messageRouter,
  user: userRouter,
  channel: channelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
