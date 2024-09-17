import React from "react";
import CreateRoom from "../components/CreateRoom";

const Home = () => {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <h1>Ved App</h1>
      <CreateRoom />
    </div>
  );
};

export default Home;
