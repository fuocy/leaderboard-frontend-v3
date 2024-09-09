import { useState } from "react";
import { useParams } from "react-router-dom";

import { games } from "../../components/Common/FeatureGameList";
import GoBack from "../../components/Common/GoBack";
import Modal from "../../components/Common/Modal";
import LeaderboardForm from "../../components/Creator/LeaderboardForm";
import { Leaderboard } from "../../utils/Type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MdDelete } from "react-icons/md";
const GameCreationPage = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const game = games.find((game) => game.name === gameName);

  const {
    data: leaderboards,
    isLoading,
    isError,
    error,
  } = useQuery<Leaderboard[]>({
    queryKey: ["leaderboards", gameName],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/api/leaderboards/${gameName}`)
        .then((res) => res.data),
  });

  const removeLeaderboardMutation = useMutation<unknown, unknown, string>({
    mutationFn: (id) =>
      axios.delete(`http://localhost:5000/api/leaderboards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboards", gameName] });
    },
  });

  const handleRemoveLeaderboard = (id: string) => {
    removeLeaderboardMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="relative p-8 h-screen">
      <div
        className="absolute inset-0 brightness-[30%]"
        style={{
          backgroundImage: `url(${game?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="z-10 relative ">
        <GoBack />

        <h1 className="text-6xl mb-12 font-semibold text-center uppercase tracking-wider text-white font-commando">
          {gameName}
        </h1>
        <button
          disabled={(leaderboards?.length as number) > 0}
          className="bg-orange-500 text-white py-3 px-6 rounded-md shadow-sm hover:bg-orange-600 transition duration-300 active:translate-y-1 font-medium text-lg mx-auto block disabled:bg-orange-400 disabled:cursor-not-allowed"
          onClick={() => setModalOpen(true)}
        >
          Create Leaderboard
        </button>
        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <LeaderboardForm
              onClose={() => setModalOpen(false)}
              gameName={gameName}
            />
          </Modal>
        )}
        {(leaderboards?.length as number) > 0 && (
          <div>
            <p className="text-4xl font-clashGrotesk font-semibold text-center mt-16 mb-4 uppercase text-white">
              The current leaderboard
            </p>

            <div className="flex items-center gap-2 justify-center">
              <div
                className="grid rounded-lg overflow-hidden max-w-[800px] "
                style={{
                  gridTemplateColumns: `repeat(${
                    leaderboards![0]!.metrics.length + 2
                  }, minmax(100px, 1fr))`,
                }}
              >
                <div className="font-bold text-lg font-clashGrotesk py-3 bg-orange-400 w-full text-center ">
                  Ranking
                </div>
                <div className="font-bold text-lg font-clashGrotesk py-3 bg-orange-400 w-full text-center">
                  Player
                </div>
                {leaderboards![0]!.metrics.map((metric: any) => (
                  <div
                    className="font-bold text-lg font-clashGrotesk py-3 bg-orange-400 w-full text-center "
                    key={metric.name}
                  >
                    {metric.name}
                  </div>
                ))}
              </div>
              <button
                onClick={handleRemoveLeaderboard.bind(
                  this,
                  leaderboards![0]!._id
                )}
                className="hover:brightness-110 transition duration-300"
              >
                <MdDelete size={45} className="text-red-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCreationPage;
