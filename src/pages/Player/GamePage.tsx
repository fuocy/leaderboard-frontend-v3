import { useEffect, useState } from "react";
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
        .then((res) => res.data),
  });
  const leaderboard = leaderboards?.[0]; // if creator create multiple leaderboards for the same game (currently impossible), take the first leaderboard.

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
  };

  useEffect(() => {
    // Ensure there is data in playerState
    if (Object.keys(playerState).length > 0) {
      // Emit updated playerState to the server via Socket.io
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
