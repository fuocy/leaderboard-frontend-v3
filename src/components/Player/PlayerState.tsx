import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Leaderboard, PlayerState } from "../../utils/Type";

interface PlayerStateBoxProps {
  leaderboard?: Leaderboard;
  playerState: PlayerState;
  handlePlayerStateChange: (metricName: string, value: any) => void;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
}

const PlayerStateBox: React.FC<PlayerStateBoxProps> = ({
  leaderboard,
  playerState,
  handlePlayerStateChange,
  setPlayerState,
}) => {
  const { username } = useAuthStore();

  useEffect(() => {
    // Set intervals for number inputs
    const intervals = leaderboard!.metrics.map((metric: any) => {
      if (metric.type === "number") {
        return setInterval(() => {
          const randomIncrement = Math.floor(Math.random() * 10); // Generate random number between 0 and 10 inside the interval
          setPlayerState((prevState) => ({
            ...prevState,
            [metric.name]: (prevState[metric.name] as number) + randomIncrement,
          }));
        }, 2000);
      }
      return null;
    });

    return () => {
      intervals.forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [leaderboard, setPlayerState]);

  return (
    <div className="px-4 py-2 rounded-lg bg-orange-200">
      <h2 className="text-xl mb-4 font-clashGrotesk font-semibold">
        Player <span className="text-orange-500"> {username}</span> State:
      </h2>
      {leaderboard!.metrics.map((metric: any) => (
        <div key={metric.name} className="mb-4">
          <label className="block mb-2 font-medium font-clashGrotesk text-lg">
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
            className="border-2 p-2 w-full outline-none border-transparent focus:border-orange-500"
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerStateBox;
