import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/router";
//Backend
import type { Message, User } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Pusher from "pusher-js";
import { env } from "src/env/client.mjs";
//Components
import TopPanel from "src/components/TopPanel";
import InputPanel from "src/components/InputPanel";
import MessagePanel from "src/components/MessagePanel";
import WrongChannelPanel from "src/components/WrongChannelPanel";
//Store
import useChattingStore from "src/store/chattingStore";

let loaded = false;

const ChannelPage: NextPage = () => {
  const { query, isReady } = useRouter();
  const channelId = React.useMemo(() => {
    if (isReady) {
      return query.channelId as string;
    } else return "";
  }, [isReady, query.channelId]);

  const { data: oldMessages, status } = trpc.message.getAll.useQuery(
    { channelId: channelId },
    { enabled: !loaded }
  );
  const [newMessages, setNewMessages] = React.useState<
    (Message & {
      author: User;
    })[]
  >([]);
  const [errorCode, setErrorCode] = React.useState(0);
  const { listRef } = useChattingStore((state) => ({ listRef: state.listRef }));
  const allChannels = trpc.channel.getAll.useQuery();
  const existingChannel = allChannels.data?.find(
    (channel) => channel.id === channelId
  );

  const scrollToLastMessage = React.useCallback(() => {
    if (listRef.current != null) {
      const lastChild = listRef.current.lastElementChild;

      lastChild?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [listRef]);

  React.useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    });

    if (isReady) {
      const channel = pusher.subscribe(channelId);

      channel.bind(
        "message",
        (
          message: Message & {
            author: User;
          }
        ) => {
          flushSync(() => {
            message.timestamp = new Date(message.timestamp);
            setNewMessages((newMessages) => [...newMessages, message]);
          });
          scrollToLastMessage();
        }
      );

      loaded = true;

      return () => {
        pusher.unsubscribe(channelId);
      };
    }
  }, [channelId, scrollToLastMessage, isReady]);

  const messages = (oldMessages ?? []).concat(newMessages);

  React.useEffect(() => {
    if (status === "success" && existingChannel === undefined) {
      setErrorCode(404);
    }
  }, [existingChannel, status]);

  return (
    <>
      <Head>
        <meta
          name="description"
          property="og:description"
          content="Chatting channel"
        />
        <meta property="og:title" content="Chatting channel" />
        <meta property="og:url" content="https://chat.mattponiat.pl/" />
        <title>Chatting channel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[100dvh] max-w-full flex-col items-center gap-5 p-6">
        <TopPanel />
        {errorCode === 404 ? (
          <WrongChannelPanel />
        ) : (
          <>
            <MessagePanel messages={messages} />
            <InputPanel channelId={channelId} />
          </>
        )}
      </main>
    </>
  );
};

export default ChannelPage;
