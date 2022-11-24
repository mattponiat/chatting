//Backend
import { trpc } from "../utils/trpc";
import { signIn, useSession, signOut } from "next-auth/react";
//Components
import ColorPicker from "../components/ColorPicker";

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

  return (
    <div className="flex w-full max-w-3xl items-center justify-end gap-2 text-white">
      {session.status === "unauthenticated" || session.status === "loading" ? (
        <button
          className="min-h-[40px] min-w-[80px] rounded-lg bg-neutral outline outline-1 outline-gray-600 transition-colors duration-150 hover:bg-base-100"
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
          <ColorPicker />
          <button
            className="min-h-[40px] min-w-[80px] rounded-lg bg-neutral outline outline-1 outline-gray-600 transition-colors duration-150 hover:bg-base-100"
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
