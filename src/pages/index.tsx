import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { flushSync } from "react-dom";
//Styles
import { TextInput, ActionIcon } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
//Helpers
import { format } from "date-fns";
import { type Messages } from "../types/types";
//Backend
import { type Message, type User } from "@prisma/client";
import { trpc } from "../utils/trpc";
import Pusher from "pusher-js";
import { signIn, useSession, signOut } from "next-auth/react";
import { env } from "../env/client.mjs";
//Components
import ColorPicker from "../components/ColorPicker";

let loaded = false;

const Home: NextPage = () => {
  const oldMessages = trpc.message.getAll.useQuery(undefined, {
    enabled: !loaded,
  });
  const sendMessage = trpc.message.send.useMutation();
  const [touched, setTouched] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Messages>([]);
  const session = useSession();
  const listRef = React.useRef<HTMLUListElement>(null);
  const currentUser = trpc.user.getCurrent.useQuery();

  const handleSendMessage = () => {
    if (message.length === 0) {
      setTouched(true);
    } else {
      sendMessage.mutateAsync({
        text: message,
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

      <main className="flex min-h-screen max-w-full flex-col items-center justify-end gap-5 p-8">
        <div className="flex w-full max-w-3xl items-center justify-end gap-2 text-[#eeeeee]">
          {session.status === "unauthenticated" ? (
            <button
              className="min-h-[40px] min-w-[80px] rounded-lg bg-[#393e46] transition-colors duration-150 hover:bg-[#444649]"
              onClick={() => signIn()}
            >
              Log In
            </button>
          ) : null}
          {session.status === "authenticated" ? (
            <>
              <div className="mr-auto flex items-center gap-2 text-lg">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  src={
                    session.data.user?.image
                      ? session.data.user.image
                      : "https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg"
                  }
                  alt="User logo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span style={{ color: currentUser.data?.color }}>
                  {session.data?.user?.name}
                </span>
              </div>
              <ColorPicker />
              <button
                className="min-h-[40px] min-w-[80px] rounded-lg bg-[#393e46] transition-colors duration-150 hover:bg-[#444649]"
                onClick={() => signOut()}
              >
                Log Out
              </button>
            </>
          ) : null}
        </div>
        <ul
          className="box-shadow flex h-[750px] w-full max-w-3xl flex-col items-start overflow-y-auto rounded-lg bg-[#393e46] px-3 pt-3 text-xl text-[#eeeeee]"
          ref={listRef}
        >
          {messages.map((message) => {
            const time = format(new Date(message.timestamp), "HH:mm");
            return (
              <li key={message.id} className="w-full break-words pb-3">
                <span className="text-sm">{time}</span>{" "}
                <span style={{ color: message.author?.color ?? "grey" }}>
                  {message.author?.name ?? "Anon"}
                </span>
                : {message.content}
              </li>
            );
          })}
        </ul>
        <div className="message-input-styles w-full max-w-lg">
          <TextInput
            radius="xl"
            size="md"
            placeholder="Send new message"
            maxLength={500}
            minLength={1}
            autoComplete="off"
            spellCheck="false"
            error={touched ? "Message can't be empty" : ""}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setTouched(false);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTouched(false)}
            rightSectionWidth={42}
            rightSection={
              <ActionIcon
                type="submit"
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
          />
        </div>
      </main>
    </>
  );
};

export default Home;
