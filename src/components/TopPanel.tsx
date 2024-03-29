import * as React from "react";
import Image from "next/image";
//Backend
import { api } from "src/utils/api";
import { signIn, useSession, signOut } from "next-auth/react";
//Components
import ColorPicker from "src/components/ColorPicker";
//Store
import useChattingStore from "src/store/chattingStore";

const TopPanel = () => {
  const session = useSession();
  const { data: currentUser } = api.user.getCurrent.useQuery(undefined, {
    enabled: session.data?.user !== undefined,
  });
  const utils = api.useContext();
  const changeColor = api.user.changeColor.useMutation({
    onSuccess: () => utils.user.getCurrent.invalidate(),
  });
  const colorRef = React.useRef("");
  const { nullUser } = useChattingStore((state) => ({
    nullUser: state.nullUser,
  }));

  const handleChangeColor = () => {
    if (currentUser?.color) {
      changeColor.mutate({
        color: colorRef.current,
      });
    }
  };

  return (
    <div className="flex w-full max-w-3xl items-center justify-end gap-2 text-white">
      {session.status === "unauthenticated" || session.status === "loading" ? (
        <button
          className="btn mr-auto w-16 justify-center rounded-lg p-2 text-xs outline outline-1 outline-gray-600 md:w-auto md:p-4 md:text-[14px]"
          onClick={() => void signIn()}
        >
          Log In
        </button>
      ) : (
        <>
          <div className="mr-auto flex items-center gap-2 text-lg">
            <Image
              src={session.data?.user?.image ?? nullUser.image}
              alt={`${session.data?.user?.name as string}'s picture`}
              width={48}
              height={48}
              className="h-10 w-10 rounded-full md:h-12 md:w-12"
              draggable={false}
            />
            <span
              style={{ color: currentUser?.color }}
              className="text-sm md:text-lg"
            >
              {session.data?.user?.name}
            </span>
          </div>
          {currentUser?.color ? (
            <>
              <label
                htmlFor="my-modal-4"
                className="btn mx-auto w-20 justify-center rounded-lg p-2 text-xs outline outline-1 outline-gray-600 md:w-auto md:p-4 md:text-[14px]"
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
                    defaultValue={hexToHsl(currentUser.color)}
                    onChange={(e) => {
                      colorRef.current = e.toString("hex");
                    }}
                    onChangeEnd={handleChangeColor}
                  />
                </label>
              </label>
            </>
          ) : null}
          <button
            className="btn ml-auto w-20 justify-center rounded-lg p-2 text-xs outline outline-1 outline-gray-600 md:w-auto md:p-4 md:text-[14px]"
            onClick={() => void signOut()}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
};

const hexToHsl = (hex: string, valuesOnly = false) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (
    result === null ||
    result[1] === undefined ||
    result[2] === undefined ||
    result[3] === undefined
  )
    throw new Error("Invalid hex");
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  let cssString = "";
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  cssString = `${h},${s}%,${l}%`;
  cssString = !valuesOnly ? "hsl(" + cssString + ")" : cssString;

  return cssString;
};

export default TopPanel;
