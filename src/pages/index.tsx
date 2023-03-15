import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import TopPanel from "src/components/TopPanel";
import { trpc } from "src/utils/trpc";
import * as React from "react";
import { flushSync } from "react-dom";
//Backend
import type { Message, User } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Pusher from "pusher-js";
import { env } from "src/env/client.mjs";
//Components
import TopPanel from "src/components/TopPanel";
import InputPanel from "src/components/InputPanel";
import MessagePanel from "src/components/MessagePanel";

let loaded = false;

const Home: NextPage = () => {
  const router = useRouter();
  const createChannel = trpc.channel.create.useMutation();

  const handleCreateChannel = async () => {
    const channel = await createChannel.mutateAsync();
    const channelUrl = `/channel/${channel.id}`;

    router.push(channelUrl);

    return channel;
  };

  return (
    <>
      <Head>
        <title>Chatting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[100dvh] max-w-full flex-col items-center p-6">
        <TopPanel />
        <button
          className="btn-secondary btn-lg btn my-auto"
          type="button"
          onClick={handleCreateChannel}
        >
          Create new channel
        </button>
      </main>
    </>
  );
};

export default Home;
