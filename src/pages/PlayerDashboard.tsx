// src/pages/PlayerDashboard.tsx
import { useNavigate } from "react-router-dom";

const PlayerDashboard = () => {
  const navigate = useNavigate();

  const games = ["Game A", "Game B", "Game C"]; // Example game names

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Choose a Game to Play</h1>
      <div className="grid grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game}
            className="bg-orange-500 text-white p-8 rounded-md cursor-pointer text-center shadow-md"
            onClick={() => navigate(`/player-dashboard/${game}`)}
          >
            <h2 className="text-lg font-bold">{game}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerDashboard;
