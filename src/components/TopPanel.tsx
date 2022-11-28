import React from "react";
//Backend
import { trpc } from "../utils/trpc";
import { signIn, useSession, signOut } from "next-auth/react";
//Components
import ColorPicker from "../components/ColorPicker";
import { parseColor } from "@react-stately/color";
//Utils
import hexToCssHsl from "../utils/hexToHSL";

type NullUser = {
  nullUser: {
    name: string;
    color: string;
    image: string;
  };
};

const TopPanel = ({ nullUser }: NullUser) => {
  const session = useSession();
  const currentUser = trpc.user.getCurrent.useQuery();
  const changeColor = trpc.user.changeColor.useMutation();
  const [color, setColor] = React.useState(parseColor("hsl(0, 100%, 50%)"));

  const handleChangeColor = () => {
    if (session.status === "authenticated") {
      changeColor.mutateAsync({
        color: color.toString("hex"),
      });
    }
  };

  return (
    <div className="flex w-full max-w-3xl items-center justify-end gap-2 text-white">
      {session.status === "unauthenticated" || session.status === "loading" ? (
        <button
          className="btn rounded-lg outline outline-1 outline-gray-600 transition-colors duration-300"
          onClick={() => signIn()}
        >
          Log In
        </button>
      ) : (
        <>
          <div className="mr-auto flex items-center gap-2 text-lg">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={session.data?.user?.image ?? nullUser.image}
              alt="User logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <span style={{ color: currentUser.data?.color }}>
              {session.data?.user?.name}
            </span>
          </div>
          {currentUser.data?.color ? (
            <>
              <label
                htmlFor="my-modal-4"
                className="btn mr-auto rounded-lg outline outline-1 outline-gray-600 transition-colors duration-300"
              >
                Change color
              </label>
              <input type="checkbox" id="my-modal-4" className="modal-toggle" />
              <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                  <h3 className="mb-6 text-xl font-bold text-neutral-content">
                    Pick a color for your chat&apos;s username
                  </h3>
                  <ColorPicker
                    channel="hue"
                    label="Hue"
                    defaultValue={hexToCssHsl(
                      currentUser.data?.color ?? "#FF0000"
                    )}
                    onChange={setColor}
                    onChangeEnd={handleChangeColor}
                  />
                </label>
              </label>
            </>
          ) : null}
          <button
            className="btn rounded-lg outline outline-1 outline-gray-600 transition-colors duration-300"
            onClick={() => signOut()}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
};

export default TopPanel;
