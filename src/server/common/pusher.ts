import PusherServer from "pusher";
import { env } from "../../env/server.mjs";

const pusher = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.PUSHER_APP_CLUSTER,
  useTLS: env.PUSHER_SERVER_TLS === "true",
});

export { pusher };
