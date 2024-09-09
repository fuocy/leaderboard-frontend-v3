import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { FaMedal } from "react-icons/fa6";
import { Leaderboard, PlayerState } from "../../utils/Type";
import LeaderboardTable from "../../components/Player/LeaderboardTable";
import { games } from "../../components/Common/FeatureGameList";
import PlayerStateBox from "../../components/Player/PlayerState";
const socket = io("http://localhost:5000");

const GamePage = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const [playerState, setPlayerState] = useState<PlayerState>({});

  const { username } = useAuthStore();

  const {
    data: leaderboards,
    isLoading,
    isError,
    error,
  } = useQuery<Leaderboard[]>({
    queryKey: ["leaderboard", gameName],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/api/leaderboards/${gameName}`)
        .then((res) => res.data), // access the first element because the api return an array of leaderboards for the specific game
  });
  const leaderboard = leaderboards?.[0]; // if creator create multiple leaderboards for the game, take the first leaderboard.

  // Set initial playerState based on the metrics of the leaderboard
  useEffect(() => {
    if (leaderboard) {
      const initialState: any = {};
      leaderboard.metrics.forEach((metric: any) => {
        initialState[metric.name] =
          metric.type === "text" ? Math.random().toString(36).substring(7) : 0; // Initialization, if metric's type string, initialize a random string, otherwise a number zero
      });
      setPlayerState(initialState);
    }
  }, [leaderboard]);

  const handlePlayerStateChange = (metricName: string, value: any) => {
    setPlayerState((prevState: any) => ({
      ...prevState,
      [metricName]: value,
    }));
    // Emit updated playerState to the server via Socket.io
    // socket.emit("player-update", {
    //   game: gameName,
    //   username,
    //   metrics: { ...playerState, [metricName]: value },
    // });
  };

  useEffect(() => {
    if (Object.keys(playerState).length > 0) {
      // Ensure there is data in playerState
      socket.emit("player-update", {
        game: gameName,
        username,
        metrics: playerState,
      });
    }
  }, [playerState, gameName, username]);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const game = games.find((game) => game.name === gameName);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  if (leaderboards?.length === 0)
    return (
      <p className="text-2xl font-clashGrotesk font-semibold text-center mt-7 up">
        There's no leaderboard for this game yet. Log in as a creator to set one
        up, and once it's ready, you can join the game as a player!
      </p>
    );
  return (
    <div className="p-8 grid grid-cols-2 gap-6">
      <div className="flex justify-center items-center min-h-screen">
        {!isGameStarted && (
          <div className="flex flex-col gap-2">
            <img
              src={game?.image}
              alt="game backdrop"
              className="object-cover w-[300px] rounded-xl"
            />

            <button
              onClick={() => {
                setIsGameStarted(true);
                socket.emit("player-update", {
                  game: gameName,
                  username,
                  metrics: playerState,
                });
              }}
              className="px-4 py-2 bg-orange-500 hover:brightness-110 transition duration-300 rounded-md active:translate-y-1 text-white text-xl font-medium uppercase font-clashGrotesk "
            >
              Start game
            </button>
          </div>
        )}

        {isGameStarted && (
          <PlayerStateBox
            leaderboard={leaderboard}
            playerState={playerState}
            handlePlayerStateChange={handlePlayerStateChange}
            setPlayerState={setPlayerState}
          />
          // <div className="px-4 py-2 rounded-lg bg-orange-200">
          //   <h2 className="text-xl mb-4 font-clashGrotesk font-semibold">
          //     Player <span className="text-orange-500"> {username}</span> State:
          //   </h2>
          //   {leaderboard!.metrics.map((metric: any) => (
          //     <div key={metric.name} className="mb-4">
          //       <label className="block mb-2 font-medium font-clashGrotesk text-lg">
          //         {metric.name} ({metric.type})
          //       </label>
          //       <input
          //         type={metric.type === "text" ? "text" : "number"}
          //         value={playerState[metric.name]}
          //         onChange={(e) =>
          //           handlePlayerStateChange(
          //             metric.name,
          //             metric.type === "text" ? e.target.value : +e.target.value
          //           )
          //         }
          //         className="border-2 p-2 w-full outline-none border-transparent focus:border-orange-500"
          //       />
          //     </div>
          //   ))}
          // </div>
        )}
      </div>

      <div>
        <h2 className="text-xl mb-4 flex gap-3 items-center justify-center">
          <FaMedal size={25} className="text-orange-500" />
          <p className="font-clashGrotesk text-3xl font-semibold uppercase ">
            "{leaderboard!.name}" Leaderboard
          </p>
          <FaMedal size={25} className="text-orange-500" />
        </h2>

        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
};

export default GamePage;
{
  /* <div
className="grid rounded-lg overflow-hidden"
style={{
  gridTemplateColumns: `repeat(${
    leaderboard!.metrics.length + 2
  }, minmax(100px, 1fr))`,
}}
>
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

{sortedLeaderboardData?.map((player, index) => (
  <React.Fragment key={index}>
    <div
      className={`font-clashGrotesk text-xl py-3 ${
        index % 2 === 0 && "bg-gray-400"
      } w-full text-center`}
    >
      0{index + 1}
    </div>
    <div
      className={`font-clashGrotesk text-xl py-3 ${
        index % 2 === 0 && "bg-gray-400"
      } w-full text-center`}
    >
      {player.username}
    </div>
    {leaderboard!.metrics.map((metric: any) => (
      <div
        className={`font-clashGrotesk text-xl py-3 ${
          index % 2 === 0 && "bg-gray-400"
        } w-full text-center`}
        key={metric.name}
      >
        {player.metrics[metric.name]}
      </div>
    ))}
  </React.Fragment>
))}
</div> */
}

{
  /* <table className="table-auto w-full">
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
        </table> */
}
