import type { NextPage } from "next";
import Head from "next/head";
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
  const oldMessages = trpc.message.getAll.useQuery(undefined, {
    enabled: !loaded,
  });
  const [newMessages, setNewMessages] = React.useState<
    (Message & {
      author: User;
    })[]
  >([]);
  const listRef = React.useRef<HTMLUListElement>(null);
  const nullUser = {
    name: "Anon",
    color: "#c2caf5",
    image:
      "https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg",
  };

  const scrollToLastMessage = () => {
    if (listRef.current != null) {
      const lastChild = listRef.current.lastElementChild;

      lastChild?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    });
    const channel = pusher.subscribe("chat");

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
      pusher.unsubscribe("chat");
    };
  }, []);

  const messages = (oldMessages?.data ?? []).concat(newMessages);

  return (
    <>
      <Head>
        <title>Simple chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[100dvh] max-w-full flex-col items-center gap-5 p-6">
        <TopPanel nullUser={nullUser} />
        <MessagePanel
          listRef={listRef}
          messages={messages}
          nullUser={nullUser}
        />
        <InputPanel />
      </main>
    </>
  );
};

export default Home;
