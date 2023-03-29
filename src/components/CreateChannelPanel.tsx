import * as React from "react";
import { useRouter } from "next/router";
//Backend
import { trpc } from "src/utils/trpc";
//Components
import { TextInput } from "@mantine/core";
import { MoonLoader } from "react-spinners";
//Utils
import { z } from "zod";
import { toast } from "react-hot-toast";

const CreateChannelPanel = () => {
  const router = useRouter();
  const [channelId, setchannelId] = React.useState("");
  const createRandomChannel = trpc.channel.createRandom.useMutation();
  const createChannel = trpc.channel.create.useMutation();
  const allChannels = trpc.channel.getAll.useQuery();

  const inputSchema = z.object({
    channelId: z
      .string()
      .trim()
      .min(1, "Channel name can't be empty")
      .max(20, "Channel name can't be longer than 20 characters"),
  });

  const handleCreateChannel = async () => {
    const results = inputSchema.safeParse({
      channelId: channelId,
    });
    const existingChannel = allChannels.data?.find(
      (channel) =>
        channel.id === channelId.trim().replace(/ +/g, "-").toLowerCase()
    );
    let errorMessage = "";

    if (existingChannel) {
      errorMessage = "Channel name already exists";
      toast.error(errorMessage);

      return;
    }

    if (results.success) {
      const channel = await createChannel.mutateAsync({
        channelId: channelId.trim().replace(/ +/g, "-").toLowerCase(),
      });
      const channelUrl = `/channel/${channel.id}`;
      router.push(channelUrl);

      return channel;
    }

    if (!results.success) {
      const formattedErrors = results.error.format();
      errorMessage = formattedErrors.channelId?._errors[0] || "";

      toast.error(errorMessage);
    }
  };

  const handleCreateRandomChannel = async () => {
    const randomChannel = await createRandomChannel.mutateAsync();
    const randomChannelUrl = `/channel/${randomChannel.id}`;

    router.push(randomChannelUrl);

    return randomChannel;
  };

  return (
    <div className="my-auto flex w-72 flex-col">
      <label
        htmlFor="my-modal-5"
        className="btn-primary btn-lg btn text-base md:text-lg"
      >
        Create new channel
      </label>
      <input
        type="checkbox"
        id="my-modal-5"
        className="modal-toggle"
        onBlur={() => setchannelId("")}
      />
      <label htmlFor="my-modal-5" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="mb-6 text-xl font-bold text-neutral-content">
            Set your channel&apos;s name
          </h3>
          <form
            className="message-input-styles flex w-full flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateChannel;
            }}
          >
            <TextInput
              type="search"
              radius="md"
              size="md"
              placeholder="Type here"
              autoComplete="off"
              spellCheck="false"
              value={channelId}
              onChange={(event) => {
                setchannelId(event.target.value);
              }}
            />
            {createChannel.isLoading ? (
              <MoonLoader className="mt-6 self-end" size={24} color="#ff79c6" />
            ) : (
              <button
                className="btn-primary btn-sm btn mt-6 w-20 self-end"
                type="submit"
                onClick={handleCreateChannel}
              >
                Create
              </button>
            )}
          </form>
        </label>
      </label>
      <div className="divider text-neutral-content">OR</div>
      {createRandomChannel.isLoading ? (
        <MoonLoader className="mt-6 self-center" size={30} color="#bd93f9" />
      ) : (
        <button
          className="btn-secondary btn-lg btn text-base md:text-lg"
          type="button"
          onClick={handleCreateRandomChannel}
        >
          Create random channel
        </button>
      )}
    </div>
  );
};

export default CreateChannelPanel;
