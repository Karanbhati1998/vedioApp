import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const CreateRoom = () => {
  const { socket } = useSocket();
  const initRoom = () => {
    socket.emit("room-create");
  };
  return (
    <button
      className="cursor-pointer btn btn-primary  flex justify-center "
      onClick={initRoom}
    >
      Start a new Metting in a new Room
    </button>
  );
};

export default CreateRoom;
