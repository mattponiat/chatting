import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { flushSync } from "react-dom";
//Styles
import { TextInput, ActionIcon } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
//Helpers
import { format } from "date-fns";
//Backend
import { trpc } from "../utils/trpc";
import { Message } from "@prisma/client";
import Pusher from "pusher-js";
import { signIn, useSession, signOut } from "next-auth/react";
import { env } from "../env/client.mjs";

let loaded = false;

const Home: NextPage = () => {
  const oldMessages = trpc.useQuery(["message.getAll"], {
    enabled: !loaded,
  });
  const sendMessage = trpc.useMutation(["message.send"]);
  const [touched, setTouched] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Message[]>([]);
  const [author, setAuthor] = React.useState<string>("");
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
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
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

  React.useEffect(() => {
    if (
      session.status === "authenticated" &&
      session.data.user?.name != undefined
    ) {
      setAuthor(session.data.user.name);
    }
    if (session.status === "unauthenticated") {
      setAuthor("Anonymous");
    }
  }, [session.data?.user?.name, session.status, setAuthor]);

  return (
    <>
      <Head>
        <title>Simple chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-end gap-5 min-h-screen p-8">
        <div className="flex items-center justify-end gap-2 max-w-3xl w-full text-[#eeeeee]">
          {session.status === "unauthenticated" ? (
            <button
              className="min-w-[80px] min-h-[40px] bg-[#393e46] hover:bg-[#444649] transition-colors duration-150 rounded-lg"
              onClick={() => signIn()}
            >
              Log In
            </button>
          ) : null}
          {session.status === "authenticated" ? (
            <>
              <div className="flex items-center gap-1 mr-auto text-lg">
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
                <span className="text-slate-300">{author}</span>
              </div>
              <button
                className="min-w-[80px] min-h-[40px] bg-[#393e46] hover:bg-[#444649] transition-colors duration-150 rounded-lg"
                onClick={() => signOut()}
              >
                Log Out
              </button>
            </>
          ) : null}
        </div>
        <ul
          className="flex flex-col items-start h-[750px] max-w-3xl w-full px-3 pt-3 bg-[#393e46] box-shadow rounded-lg text-[#eeeeee] text-xl overflow-y-auto"
          ref={listRef}
        >
          {messages.map((message) => {
            const time = format(new Date(message.timestamp), "HH:mm");
            return (
              <li key={message.id} className="pb-3 w-full break-words">
                <span className="text-sm">{time}</span>{" "}
                <span className="text-slate-300">{message.author}</span>:{" "}
                {message.content}
              </li>
            );
          })}
        </ul>
        <div className="max-w-lg w-full message-input-styles">
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
            rightSectionWidth={42}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
