//Types
import type { Message, User } from "@prisma/client";
//Utils
import { format } from "date-fns";
import useChattingStore from "src/store/chattingStore";

type MessagePanelProps = {
  messages: (Message & {
    author: User | null;
  })[];
};

const MessagePanel = ({ messages }: MessagePanelProps) => {
  const { nullUser, listRef } = useChattingStore((state) => ({
    nullUser: state.nullUser,
    listRef: state.listRef,
  }));

  return (
    <ul
      className="flex h-[100dvh] w-full max-w-3xl flex-col items-start overflow-y-auto rounded-lg bg-neutral px-3 pt-3 text-xl text-white outline outline-1 outline-gray-600 "
      ref={listRef}
    >
      {messages.map((message) => {
        const time = format(new Date(message.timestamp), "HH:mm");

        return (
          <li key={message.id} className="w-full break-words pb-3">
            <span className="align-bottom text-sm">{time}</span>{" "}
            <span style={{ color: message.author?.color ?? nullUser.color }}>
              {message.author?.name ?? nullUser.name}
            </span>
            : {message.content}
          </li>
        );
      })}
    </ul>
  );
};

export default MessagePanel;
