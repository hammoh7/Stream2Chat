import { MessageCircleCode } from "lucide-react";

export const Start = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-300 to-blue-400">
      <header className="bg-white flex justify-between p-5 border-b">
        <div className="flex gap-7">
          <a className="flex font-bold text-2xl text-blue-600" href="/">
            <MessageCircleCode className="mr-2 h-7 w-7" />
            Stream2Chat
          </a>
          <nav className="flex items-center gap-5 ml-5 text-gray-700 text-md">
            <button className="bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded">
              <a href="/about">About Us</a>
            </button>
            <button className="bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded">
              <a href="/contact">Contact Us</a>
            </button>
          </nav>
        </div>
      </header>
      <section className="p-10 pt-32 max-w-5xl mx-auto">
        <div className="max-w-md mb-20">
          <h1 className="text-4xl font-extrabold">
            Open up the World,
            <br /> in one Click
            <br /> with Stream2Chat
          </h1>
          <h2 className="text-xl font-semibold text-slate-600 mt-5">
            Every click opens a portal to excitement and discovery. Join now for
            an electrifying blend of glamour, mystery, and unscripted
            connections that redefine online socializing!"
          </h2>
        </div>
        <div>
          <form className="flex items-center">
            <button className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded">
              <a href="/home">Join the Conversation</a>
            </button>
          </form>
        </div>
      </section>
      <footer className="bg-white fixed bottom-0 w-full p-4 border-t">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between space-x-8">
          <a
            className="font-bold text-lg text-blue-600 flex items-center justify-center"
            href="/"
          >
            <MessageCircleCode className="mr-2 h-7 w-7" />
            Stream2Chat
          </a>
          <div className="space-x-6 md:block md:w-auto flex items-center justify-between ml-auto p-2">
            <button>Privacy Policy</button>
            <button>Terms & Conditions</button>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Start;
