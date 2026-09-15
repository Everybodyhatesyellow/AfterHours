import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateParty from "./pages/CreateParty";
import JoinParty from "./pages/JoinParty";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<CreateParty />} />
      <Route path="/join" element={<JoinParty />} />
      <Route path="/room/:code" element={<Lobby />} />
      <Route path="/room/:code/play" element={<Game />} />
      <Route path="/room/:code/results" element={<Results />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
