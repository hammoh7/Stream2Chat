import { useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col items-center space-y-5 mt-32">
    <div style={{  }}>
      <input
        autoFocus
        className="border border-gray-300 focus:outline-none focus:border-blue-500 rounded-md px-4 py-2 text-center"
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
    </div>
    <div>
      <Link to={`/room/?name=${name}`}>
        <button className="bg-black hover:bg-gray-800 text-white font-semibold py-1.5 px-3 rounded">
          Join
        </button>
      </Link>
    </div>
  </div>
  
  );
};

export default Home;
