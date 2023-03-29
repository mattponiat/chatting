import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "src/utils/trpc";

import "src/styles/globals.css";
import { Asap } from "@next/font/google";
import { Toaster } from "react-hot-toast";
import { useWindowSize } from "usehooks-ts";

const asap = Asap({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { width } = useWindowSize();
  const isSmall = width <= 768;
  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${asap.style.fontFamily};
        }

        [role="alert"] {
          font-family: ${asap.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <Toaster
          position={isSmall ? "top-right" : "bottom-right"}
          toastOptions={{
            style: {
              backgroundColor: "#414558",
              color: "#c2cbf5",
            },
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
