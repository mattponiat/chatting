import Link from "next/link";

const WrongChannelPanel = () => {
  return (
    <div className="hero my-auto">
      <div className="hero-content text-center">
        <div className="max-w-fit">
          <h1 className="text-5xl font-bold">
            This channel doesn&apos;t exist 😥
          </h1>
          <p className="py-6">Click here to go back to the homepage.</p>
          <Link href="/">
            <button className="btn-primary btn">Go back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WrongChannelPanel;
