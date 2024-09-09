import React, { useEffect, useState } from "react";
import { Leaderboard, LeaderboardData } from "../../utils/Type";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
interface LeaderboardTableProps {
  leaderboard?: Leaderboard;
}
const socket = io("http://localhost:5000");
const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard }) => {
  const { gameName } = useParams<{ gameName: string }>();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  // useEffect(() => {
  //   socket.on("leaderboard-update", (data: any) => {
  //     if (data.game === gameName) {
  //       setLeaderboardData((prev) => [
  //         ...prev.filter((p) => p.username !== data.username),
  //         data,
  //       ]);
  //     }
  //   });

  //   return () => {
  //     socket.off("leaderboard-update");
  //   };
  // }, [gameName]);

  useEffect(() => {
    // Listen for leaderboard updates
    socket.on("leaderboard-update", (data: any[]) => {
      // Filter the players for the current game
      const filteredData = data.filter((player) => player.game === gameName);

      // Update the leaderboard with the filtered data
      setLeaderboardData(filteredData);
    });

    return () => {
      socket.off("leaderboard-update");
    };
  }, [gameName]);

  // Sort leaderboard data based on the sorting property of the leaderboard
  const sortedLeaderboardData = leaderboard?.sorting
    ? [...leaderboardData].sort((a, b) => {
        const metric = leaderboard.sorting!.metric;
        const order = leaderboard.sorting!.order === "desc" ? -1 : 1;
        return a.metrics[metric] > b.metrics[metric] ? order : -order;
      })
    : leaderboardData;

  return (
    <div
      className="grid rounded-lg overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${
          leaderboard!.metrics.length + 2
        }, minmax(100px, 1fr))`,
      }}
    >
      {/* Header Row */}
      <div className="font-bold text-lg font-clashGrotesk py-3 bg-orange-400 w-full text-center ">
        Ranking
      </div>
      <div className="font-bold text-lg font-clashGrotesk py-3 bg-orange-400 w-full text-center">
        Player
      </div>
      {leaderboard!.metrics.map((metric: any) => (
        <div
          className="font-bold text-lg font-clashGrotesk py-3 bg-orange-400 w-full text-center "
          key={metric.name}
        >
          {metric.name}
        </div>
      ))}

      {/* Player Data Rows */}
      {sortedLeaderboardData?.map((player, index) => (
        <React.Fragment key={index}>
          <div
            className={`font-clashGrotesk text-xl py-3 ${
              index % 2 === 0 && "bg-gray-200"
            } w-full text-center`}
          >
            0{index + 1}
          </div>
          <div
            className={`font-clashGrotesk text-xl py-3 ${
              index % 2 === 0 && "bg-gray-200"
            } w-full text-center`}
          >
            {player.username}
          </div>
          {leaderboard!.metrics.map((metric: any) => (
            <div
              className={`font-clashGrotesk text-xl py-3 ${
                index % 2 === 0 && "bg-gray-200"
              } w-full text-center`}
              key={metric.name}
            >
              {player.metrics[metric.name]}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LeaderboardTable;
