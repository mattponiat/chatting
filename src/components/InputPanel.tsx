import * as React from "react";
//Backend
import { api } from "src/utils/api";
//Utils
import { toast } from "react-hot-toast";
//Components
import { ActionIcon, TextInput } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

type InputPanelProps = {
  channelId: string;
};

const InputPanel = ({ channelId }: InputPanelProps) => {
  const [message, setMessage] = React.useState("");
  const sendMessage = api.message.send.useMutation({
    onSuccess: () => {
      setMessage("");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.text;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      }
    },
  });

  const handleSendMessage = () => {
    sendMessage.mutate({
      text: message,
      channelId: channelId,
    });
  };

  return (
    <div className="message-input-styles w-full max-w-lg">
      <TextInput
        type="search"
        radius="md"
        size="md"
        placeholder="Send a new message"
        autoComplete="off"
        spellCheck="false"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        rightSectionWidth={42}
        rightSection={
          <ActionIcon
            type="submit"
            className="bg-secondary transition-all duration-200 hover:bg-secondary-focus"
            size={32}
            radius="md"
            variant="filled"
            onClick={handleSendMessage}
          >
            <IconArrowRight size={18} stroke={1.5} color="#414558" />
          </ActionIcon>
        }
      />
    </div>
  );
};

export default InputPanel;
