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
const WS_Server = "https://chatapp-backend-three-iota.vercel.app/";
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
    });
    setUser(newPeer);
    fetchUserFeed();

    const handleRoomCreate = ({ roomId }) => {
      console.log("Room created: ", { roomId });
      navigate(`/room/${roomId}`);
    };

    const handleGetUsers = ({ roomId, participants }) => {
      console.log("Participants: ", { roomId, participants });
    };

    socket.on("room-create", handleRoomCreate);
    socket.on("get-users", handleGetUsers);

    return () => {
      socket.off("room-create", handleRoomCreate);
      socket.off("get-users", handleGetUsers);
    };
  }, [navigate, socket]);

  useEffect(() => {
    if (!user || !stream) return;

    const handleUserJoined = ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log("Calling the new peer", peerId);
      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream));
      });
    };

    const handleCall = (call) => {
      console.log("Receiving a call");
      call.answer(stream);
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream));
      });
    };

    socket.on("user-joined", handleUserJoined);
    user.on("call", handleCall);

    socket.emit("ready");

    return () => {
      socket.off("user-joined", handleUserJoined);
      user.off("call", handleCall);
    };
  }, [user, stream, socket]);

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
