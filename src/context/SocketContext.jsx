import SocketIoClient from "socket.io-client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { peerReducer } from "../reducers/peerReducers";
import { addPeerAction, removePeerAction } from "../actions/peerAction";
const WS_Server = "http://localhost:5500";
const SocketContext = createContext(null);
const socket = SocketIoClient(WS_Server);

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [stream, setStream] = useState("");
  const navigate = useNavigate();
  const [peers, dispatch] = useReducer(peerReducer, {});
  const fetchUserFeed = async () => {
    const streamdata = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(streamdata);
    console.log("Stream fetched: ", streamdata);
  };

  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      secure: true,
      host: "0.peerjs.com",
      port: "443",
      config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302", // Google STUN server
          },
          {
            urls: "turn:your-turn-server.com", // Apna TURN server
            username: "username", // TURN server username
            credential: "password", // TURN server password
          },
        ],
      },
    });
    setUser(newPeer);
    fetchUserFeed();
    socket.on("room-create", ({ roomId }) => {
      console.log("Room created: ", { roomId });
      navigate(`/room/${roomId}`);
    });
    socket.on("get-users", ({ roomId, participants }) => {
      console.log("Participants: ", { roomId, participants });
    });
  }, []);
  useEffect(() => {
    if (!user || !stream) return;
    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log("Calling the new peer", peerId);
      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream));
      });
    });

    user.on("call", (call) => {
      console.log("receiving a call");
      call.answer(stream);
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream));
      });
    });

    socket.emit("ready");
  }, [user, stream]);
  const handleRemove = (id) => {
    dispatch(removePeerAction(id));
  };
  return (
    <SocketContext.Provider
      value={{ socket, user, stream, peers, handleRemove }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const { socket, user, stream, peers, handleRemove } =
    useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return { socket, user, stream, peers, handleRemove };
};
