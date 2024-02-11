import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:3000";
declare global {
  interface Window {
    pcr: RTCPeerConnection;
  }
}

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = io(URL);
    socket.on("", async ({ roomId }) => {
      console.log("sending request");
      setLobby(false);
      const pc = new RTCPeerConnection();

      setSendingPc(pc);
      if (localVideoTrack) {
        console.log(localVideoTrack);
        pc.addTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        console.log(localAudioTrack);
        pc.addTrack(localAudioTrack);
      }

      pc.onicecandidate = async (e) => {
        console.log("receiving ice candidate locally");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation neeeded, sending request");
        const sdp = await pc.createOffer();
        //@ts-ignore
        pc.setLocalDescription(sdp);
        socket.emit("request", {
          sdp,
          roomId,
        });
      };
    });

    socket.on("request", async ({ roomId, sdp: remoteSdp }) => {
      console.log("received request");
      setLobby(false);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(remoteSdp);
      const sdp = await pc.createAnswer();
      //@ts-ignore
      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }

      setRemoteMediaStream(stream);
      // trickle ice
      setReceivingPc(pc);
      window.pcr = pc;
      pc.ontrack = () => {
        alert("ontrack");
      };

      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        console.log("on-ice candidate on receiving side");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "receiver",
            roomId,
          });
        }
      };

      socket.emit("answer", {
        roomId,
        sdp: sdp,
      });
      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;
        console.log(track1);
        if (track1.kind === "video") {
          setRemoteAudioTrack(track2);
          setRemoteVideoTrack(track1);
        } else {
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track1);
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track2);
        //@ts-ignore
        remoteVideoRef.current.play();
      }, 5000);
    });

    socket.on("answer", ({ sdp: remoteSdp }) => {
      setLobby(false);
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp);
        return pc;
      });
      console.log("loop closed");
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("add ice candidate from remote");
      console.log({ candidate, type });
      if (type == "sender") {
        setReceivingPc((pc) => {
          if (!pc) {
            console.error("receiving pc not found");
          } else {
            console.error(pc.ontrack);
          }
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          if (!pc) {
            console.error("sending pc not found");
          } else {
            console.error(pc.ontrack);
          }
          pc?.addIceCandidate(candidate);
          return pc;
        });
      }
    });

    setSocket(socket);
  }, [name]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        localVideoRef.current.play();
      }
    }
  }, [localVideoRef]);

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-2xl font-bold mb-4 mt-12">Hello, {name}</p>
      <div className="flex flex-wrap justify-around mt-4">
        <video
          className="w-400 h-400 border-4 border-blue-500 m-8"
          autoPlay
          width={500}
          height={500}
          ref={localVideoRef}
        />
        {lobby ? (
          <>
            <Loader className="animate-spin mr-2" />
            <p>Waiting for someone to connect</p>
          </>
        ) : null}
        <video
          className="w-400 h-400 border-4 border-blue-500 m-8"
          autoPlay
          width={500}
          height={500}
          ref={remoteVideoRef}
        />
      </div>
    </div>
  );
};

export default Room;
