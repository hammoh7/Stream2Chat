import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Room from "./Room";

export const Home = () => {
  const [name, setName] = useState("");
  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [joined, setJoined] = useState(false);

  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // MediaStream
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setLocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
  }, [videoRef]);

  if (!joined) {
    return (
      <div className="flex flex-col items-center space-y-5 mt-24">
        <div style={{}}>
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
          <button onClick={() => {
            setJoined(true);
          }} 
          className="bg-black hover:bg-gray-800 text-white font-semibold py-1.5 px-3 rounded">
            Join
          </button>
        </div>
        <video className="w-500 h-500 rounded-lg shadow-lg mx-auto my-10 mb-5" autoPlay ref={videoRef}></video>
      </div>
    );
  }

  return (
    <Room
      name={name}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTrack}
    />
  );
};

export default Home;
