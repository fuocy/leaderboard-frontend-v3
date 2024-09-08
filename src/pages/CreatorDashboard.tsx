// src/pages/CreatorDashboard.tsx
import { useNavigate } from "react-router-dom";

const CreatorDashboard = () => {
  const navigate = useNavigate();

  const games = ["Game A", "Game B", "Game C"]; // Game names

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Select a Game to Create Leaderboards</h1>
      <div className="grid grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game}
            className="bg-orange-500 text-white p-8 rounded-md cursor-pointer text-center shadow-md hover:brightness-110 transition duration-300 active:translate-y-1"
            onClick={() => navigate(`/creator-dashboard/${game}`)}
          >
            <h2 className="text-lg font-bold">{game}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorDashboard;
