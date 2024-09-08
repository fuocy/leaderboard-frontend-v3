import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

const socket = io("http://localhost:5000");

const GamePage = () => {
  const { gameName } = useParams<{ gameName: string }>(); // Get the selected game name from the URL params
  const [playerState, setPlayerState] = useState<any>({});
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const { username } = useAuthStore();
  // Fetch the leaderboard for the selected game
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", gameName],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/api/leaderboards/${gameName}`)
        .then((res) => res.data[0]), // access the first element because the api return an array of leaderboards for the specific game
  });

  // Set initial playerState based on the metrics of the leaderboard
  useEffect(() => {
    if (leaderboard) {
      const initialState: any = {};
      leaderboard.metrics.forEach((metric: any) => {
        initialState[metric.name] = metric.type === "text" ? "" : 0; // Set initial values for text and number types
      });
      setPlayerState(initialState);
    }
  }, [leaderboard]);

  // Listen for leaderboard updates
  useEffect(() => {
    socket.on("leaderboard-update", (data: any) => {
      // Check if the data corresponds to the current game
      if (data.game === gameName) {
        setLeaderboardData((prev) => [
          ...prev.filter((p) => p.username !== data.username),
          data,
        ]);
      }
    });

    return () => {
      socket.off("leaderboard-update"); // Clean up when the component unmounts
    };
  }, [gameName]);

  // Handle player state changes
  const handlePlayerStateChange = (metricName: string, value: any) => {
    setPlayerState((prevState: any) => ({
      ...prevState,
      [metricName]: value,
    }));
    // Emit updated playerState to the server via Socket.io
    socket.emit("player-update", {
      game: gameName,
      username,
      metrics: { ...playerState, [metricName]: value },
    });
  };

  // Sort leaderboard data based on the sorting property of the leaderboard
  const sortedLeaderboardData = leaderboard?.sorting
    ? [...leaderboardData].sort((a, b) => {
        const metric = leaderboard.sorting.metric;
        const order = leaderboard.sorting.order === "desc" ? -1 : 1;
        return a.metrics[metric] > b.metrics[metric] ? order : -order;
      })
    : leaderboardData;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-2 gap-6">
      {/* Player Inputs */}
      <div>
        <h2 className="text-xl mb-4">Update Metrics</h2>
        {leaderboard.metrics.map((metric: any) => (
          <div key={metric.name} className="mb-4">
            <label className="block mb-2">
              {metric.name} ({metric.type})
            </label>
            <input
              type={metric.type === "text" ? "text" : "number"}
              value={playerState[metric.name]}
              onChange={(e) =>
                handlePlayerStateChange(
                  metric.name,
                  metric.type === "text" ? e.target.value : +e.target.value
                )
              }
              className="border p-2 w-full"
            />
          </div>
        ))}
      </div>

      {/* Live Leaderboard */}
      <div>
        <h2 className="text-xl mb-4">Live Leaderboard</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Player</th>
              {leaderboard.metrics.map((metric: any) => (
                <th key={metric.name}>{metric.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboardData?.map((player, index) => (
              <tr key={index}>
                <td>{player.username}</td>
                {leaderboard.metrics.map((metric: any) => (
                  <td key={metric.name}>{player.metrics[metric.name]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GamePage;
