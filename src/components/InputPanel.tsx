import * as React from "react";
//Backend
import { trpc } from "src/utils/trpc";
//Utils
import { z } from "zod";
//Styles
import { ActionIcon, TextInput } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";

type InputPanelProps = {
  channelId: string;
};

const InputPanel = ({ channelId }: InputPanelProps) => {
  const [message, setMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const sendMessage = trpc.message.send.useMutation();

  const inputSchema = z.object({
    message: z
      .string()
      .trim()
      .min(1, "Message can't be empty")
      .max(500, "Message can't be longer than 500 characters"),
  });

  const handleSendMessage = () => {
    const results = inputSchema.safeParse({
      message: message,
    });

    if (results.success) {
      sendMessage.mutate({
        text: message,
        channelId: channelId,
      });
      setMessage("");
      setTouched(false);
    }

    if (!results.success) {
      const formattedErrors = results.error.format();
      setErrorMessage(formattedErrors.message?._errors[0] || "");
      setTouched(true);
    } else {
      setErrorMessage("");
    }
  };

  return (
    <form
      className="message-input-styles w-full max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage;
      }}
    >
      <TextInput
        radius="md"
        size="md"
        placeholder="Send a new message"
        autoComplete="off"
        spellCheck="false"
        error={touched ? errorMessage : ""}
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setTouched(false);
        }}
        onBlur={() => setTouched(false)}
        rightSectionWidth={42}
        rightSection={
          <ActionIcon
            type="submit"
            className="bg-secondary transition-all duration-200 hover:bg-secondary-focus"
            size={32}
            radius="md"
            variant="filled"
            onBlur={() => setTouched(false)}
            onClick={handleSendMessage}
          >
            <IconArrowRight size={18} stroke={1.5} color="#414558" />
          </ActionIcon>
        }
      />
    </form>
  );
};

export default InputPanel;
