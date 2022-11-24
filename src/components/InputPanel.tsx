//Styles
import { ActionIcon, TextInput } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";

type InputPanelProps = {
  touched: boolean;
  setTouched: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: { key: string }) => void;
  handleSendMessage: () => void;
};

const InputPanel = ({
  touched,
  setTouched,
  message,
  setMessage,
  handleKeyDown,
  handleSendMessage,
}: InputPanelProps) => {
  return (
    <div className="message-input-styles w-full max-w-lg">
      <TextInput
        radius="md"
        size="md"
        placeholder="Send a new message"
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
            className="bg-secondary transition-all duration-300 hover:bg-secondary-focus"
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
    </div>
  );
};

export default InputPanel;
