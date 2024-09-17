import { Route, Routes } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import Home from "./pages/Home";
import Room from "./pages/Room";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </>
  );
}
