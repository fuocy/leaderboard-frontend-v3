import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameCreationPage from "./pages/GameCreationPage";
import GamePage from "./pages/GamePage";
import Home from "./pages/Home";
import CreatorDashboard from "./pages/CreatorDashboard";
import PlayerDashboard from "./pages/PlayerDashboard";
const queryClient = new QueryClient();

function App() {
  const { username, role } = useAuthStore();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {role === "creator" && (
            <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          )}
          {role === "creator" && (
            <Route
              path="/creator-dashboard/:gameName"
              element={<GameCreationPage />}
            />
          )}
          {role === "player" && (
            <Route path="/player-dashboard" element={<PlayerDashboard />} />
          )}
          {role === "player" && (
            <Route path="/player-dashboard/:gameName" element={<GamePage />} />
          )}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
