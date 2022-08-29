import PusherServer from "pusher";

const pusher = new PusherServer({
  appId: "1469769",
  key: "1b4ce088cf6b223134ec",
  secret: "28756013e1f0293e2bb7",
  cluster: "eu",
  useTLS: true,
});

export { pusher };
