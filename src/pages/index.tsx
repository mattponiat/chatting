import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { trpc } from "../utils/trpc";
import { useLocalStorageState } from "ahooks";
import Pusher from "pusher-js";
import { Message } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { TextInput, ActionIcon } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { format } from "date-fns";
import { flushSync } from "react-dom";

let loaded = false;

const Home: NextPage = () => {
  const oldMessages = trpc.useQuery(["message.getAll"], {
    enabled: !loaded,
  });
  const sendMessage = trpc.useMutation(["message.send"]);
  const [touched, setTouched] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Message[]>([]);
  const [author, setAuthor] = useLocalStorageState<string>("author", {
    defaultValue: "",
  });
  const session = useSession();
  const listRef = React.useRef<HTMLUListElement>(null);

  const handleSendMessage = () => {
    if (message.length === 0) {
      setTouched(true);
    } else {
      sendMessage.mutateAsync({
        text: message,
        author: author,
      });
      setTouched(false);
      setMessage("");
    }
  };
  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
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
    const pusher = new Pusher("1b4ce088cf6b223134ec", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");

    channel.bind("message", (message: Message) => {
      flushSync(() => {
        message.timestamp = new Date(message.timestamp);
        setNewMessages((newMessages) => [...newMessages, message]);
      });
      scrollToLastMessage();
    });

    loaded = true;

    return () => {
      pusher.disconnect();
    };
  }, []);

  const messages = (oldMessages?.data ?? []).concat(newMessages);

  return (
    <>
      <Head>
        <title>Simple chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-end gap-5 min-h-screen p-8">
        <div className="max-w-[200px] w-full author-input-styles">
          <TextInput
            placeholder="Your username"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <ul
          className="flex flex-col items-start h-[755px] max-w-3xl w-full px-3 pt-3 bg-[#393e46] box-shadow rounded-lg text-[#eeeeee] text-xl overflow-y-scroll"
          ref={listRef}
        >
          {messages.map((message) => {
            const time = format(new Date(message.timestamp), "HH:mm");
            return (
              <li key={message.id} className="pb-3 w-full break-all">
                <span className="text-sm">{time}</span> {message.author}:{" "}
                {message.content}
              </li>
            );
          })}
        </ul>
        <div className="max-w-lg w-full message-input-styles">
          <TextInput
            radius="xl"
            size="md"
            placeholder="Post a new message"
            error={touched ? "Message can't be empty" : ""}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setTouched(false);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTouched(false)}
            rightSection={
              <ActionIcon
                className="bg-yellow-500 transition-all duration-150"
                size={32}
                radius="xl"
                variant="filled"
                color="yellow"
                onBlur={() => setTouched(false)}
                onClick={handleSendMessage}
              >
                <IconArrowRight size={18} stroke={1.5} />
              </ActionIcon>
            }
            rightSectionWidth={42}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
