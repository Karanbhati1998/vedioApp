import React, { useEffect, useRef } from "react";

const UserFeed = ({ stream, peerId, handleRemove }) => {
  const videoRef = useRef(null);
  console.log({ stream });

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log("Stream available, attaching to video element");
      videoRef.current.srcObject = stream;
    } else {
      console.log("No stream or video element not available");
    }
  }, [stream]);

  return (
    <>
      <video
        ref={videoRef}
        style={{
          width: "10px",
          height: "10px",
          objectFit: "cover",
          border: "1px solid",
        }}
        muted={true}
        autoPlay
      />
      <button onClick={() => handleRemove(peerId)}>Delete</button>
    </>
  );
};

export default UserFeed;
