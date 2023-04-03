import * as React from "react";
import { useRouter } from "next/router";
//Backend
import { api } from "src/utils/api";
//Components
import { TextInput } from "@mantine/core";
import { MoonLoader } from "react-spinners";
//Utils
import { toast } from "react-hot-toast";

const CreateChannelPanel = () => {
  const router = useRouter();
  const [channelId, setchannelId] = React.useState("");
  const allChannels = api.channel.getAll.useQuery();
  const existingChannel = allChannels.data?.find(
    (channel) =>
      channel.id === channelId.trim().replace(/ +/g, "-").toLowerCase()
  );
  const createRandomChannel = api.channel.createRandom.useMutation();
  const createChannel = api.channel.create.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.channelId;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      }
    },
  });

  const handleCreateChannel = async () => {
    if (existingChannel) {
      toast.error("Channel name already exists");
      return;
    }

    const channel = await createChannel.mutateAsync({
      channelId: channelId.trim().replace(/ +/g, "-").toLowerCase(),
    });
    const channelUrl = `/channel/${channel.id}`;
    await router.push(channelUrl);

    return channel;
  };

  const handleCreateRandomChannel = async () => {
    const randomChannel = await createRandomChannel.mutateAsync();
    const randomChannelUrl = `/channel/${randomChannel.id}`;

    console.log(randomChannel);

    await router.push(randomChannelUrl);

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
          <div className="message-input-styles flex w-full flex-col">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleCreateChannel();
                }
              }}
            />
            {createChannel.isLoading ? (
              <MoonLoader className="mt-6 self-end" size={24} color="#ff79c6" />
            ) : (
              <button
                className="btn-primary btn-sm btn mt-6 w-20 self-end"
                type="submit"
                onClick={() => void handleCreateChannel()}
              >
                Create
              </button>
            )}
          </div>
        </label>
      </label>
      <div className="divider text-neutral-content">OR</div>
      {createRandomChannel.isLoading ? (
        <MoonLoader className="mt-6 self-center" size={30} color="#bd93f9" />
      ) : (
        <button
          className="btn-secondary btn-lg btn text-base md:text-lg"
          type="button"
          onClick={() => void handleCreateRandomChannel()}
        >
          Create random channel
        </button>
      )}
    </div>
  );
};

export default CreateChannelPanel;
