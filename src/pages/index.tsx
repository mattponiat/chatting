import type { NextPage } from "next";
import Head from "next/head";
//Components
import TopPanel from "src/components/TopPanel";
import CreateChannelPanel from "src/components/CreateChannelPanel";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <meta
          name="description"
          property="og:description"
          content="Chatting app"
        />
        <meta property="og:title" content="Chatting" />
        <meta property="og:url" content="https://chat.mattponiat.pl/" />
        <title>Chatting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[100dvh] max-w-full flex-col items-center p-6">
        <TopPanel />
        <CreateChannelPanel />
      </main>
    </>
  );
};

export default Home;
