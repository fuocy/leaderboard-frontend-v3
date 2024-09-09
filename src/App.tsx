import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameCreationPage from "./pages/Creator/GameCreationPage";
import Home from "./pages/Home";
import CreatorDashboard from "./pages/Creator/CreatorDashboard";
import PlayerDashboard from "./pages/Player/PlayerDashboard";
import GamePage from "./pages/Player/GamePage";
const queryClient = new QueryClient();

function App() {
  const { role } = useAuthStore();
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
          <Route path="*" element={<p>NOT FOUND</p>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
