import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import UserFeed from "../components/UserFeed";

const Room = () => {
  const { id } = useParams();
  const { socket, user, stream, peers, handleRemove } = useSocket();
  useEffect(() => {
    if (user) socket.emit("joined-room", { roomId: id, peerId: user._id });
  }, [id, user, socket, peers]);
  console.log({ peers });

  return (
    <div>
      Room :{id}
      <h1>Your own feed </h1>
      <UserFeed stream={stream} />
      <div>
        <h2>Other user feed</h2>
        {Object.keys(peers).map((peerId) => {
          return (
            <>
              <UserFeed
                key={peerId}
                stream={peers[peerId].stream}
                handleRemove={handleRemove}
                peerId={peerId}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Room;
