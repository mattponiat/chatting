import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "src/utils/trpc";

import "src/styles/globals.css";
import { Asap } from "@next/font/google";
import { Toaster } from "react-hot-toast";

const asap = Asap({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
          position="bottom-right"
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
