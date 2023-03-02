import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import TopPanel from "src/components/TopPanel";

const Home: NextPage = () => {
  const router = useRouter();
  const randomChannel = Math.random().toString().slice(2, 12);

  return (
    <>
      <Head>
        <title>Chatting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[100dvh] max-w-full flex-col items-center p-6">
        <TopPanel />
        <button
          className="btn-secondary btn-lg btn my-auto"
          type="button"
          onClick={() => router.push(`/channel/${randomChannel}`)}
        >
          Create new channel
        </button>
      </main>
    </>
  );
};

export default Home;
