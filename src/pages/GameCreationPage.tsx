import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import LeaderboardForm from "../components/Creator/LeaderboardForm";
import { IoMdArrowRoundBack } from "react-icons/io";
// interface Metric {
//   name: string;
//   type: "number" | "text";
// }

// type Order = "asc" | "desc";

// interface Leaderboard {
//   game: string;
//   name: string;
//   metrics: Metric[];
//   sorting: {
//     metric: string;
//     order: Order;
//   } | null;
// }

const GameCreationPage = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const [isModalOpen, setModalOpen] = useState(false);
  // const [leaderboardName, setLeaderboardName] = useState("");
  // const [metrics, setMetrics] = useState<Metric[]>([]); // List of metrics
  // const [metricName, setMetricName] = useState("");
  // const [metricType, setMetricType] = useState<"number" | "text">("number");
  // const [selectedMetricForSorting, setSelectedMetricForSorting] = useState<
  //   string | null
  // >(null);

  // const queryClient = useQueryClient();

  // const createLeaderboardMutation = useMutation<unknown, unknown, Leaderboard>({
  //   mutationFn: (newLeaderboard) =>
  //     axios.post(
  //       "http://localhost:5000/api/leaderboards/create",
  //       newLeaderboard
  //     ),
  //   onSuccess: () =>
  //     queryClient.invalidateQueries({ queryKey: ["leaderboards", gameName] }),
  // });

  // const handleAddMetric = () => {
  //   if (metricName.trim()) {
  //     setMetrics([...metrics, { name: metricName, type: metricType }]);
  //     setMetricName("");
  //   }
  // };

  // const handleCreateLeaderboard = () => {
  //   if (leaderboardName.trim()) {
  //     const sorting = selectedMetricForSorting
  //       ? { metric: selectedMetricForSorting, order: "desc" as Order }
  //       : null; // Def

  //     createLeaderboardMutation.mutate({
  //       game: gameName!,
  //       name: leaderboardName,
  //       metrics,
  //       sorting,
  //     });

  //     setModalOpen(false);
  //   }
  // };

  const navigate = useNavigate();

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex gap-2 items-center mb-10"
      >
        <IoMdArrowRoundBack size={30} className="text-orange-500 " />
        <p className="text-orange-500 text-lg font-medium">Back</p>
      </button>
      <h1 className="text-3xl mb-6 font-semibold text-center uppercase tracking-wider">
        {" "}
        "{gameName}" Creation
      </h1>
      <button
        className="bg-orange-500 text-white py-3 px-6 rounded-md shadow-sm hover:bg-orange-600 transition duration-300 active:translate-y-1 font-medium text-lg mx-auto block"
        onClick={() => setModalOpen(true)}
      >
        Create Leaderboard
      </button>

      {/* Modal Popup for creating leaderboard */}
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <LeaderboardForm
            onClose={() => setModalOpen(false)}
            gameName={gameName}
          />
          {/* <div className="p-8">
            <h2 className="text-xl mb-4">Create Leaderboard</h2>

            <input
              className="border p-2 mb-4 w-full"
              placeholder="Leaderboard Name"
              value={leaderboardName}
              onChange={(e) => setLeaderboardName(e.target.value)}
            />

            <div className="mb-4">
              <input
                className="border p-2 mb-2 w-full"
                placeholder="Metric Name"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
              />
              <select
                className="border p-2 mb-4 w-full"
                value={metricType}
                onChange={(e) =>
                  setMetricType(e.target.value as "number" | "text")
                }
              >
                <option value="number">Number</option>
                <option value="text">Text</option>
              </select>
              <button
                className="bg-blue-500 text-white p-2 w-full"
                onClick={handleAddMetric}
              >
                Add Metric
              </button>
            </div>

            <ul className="mb-4">
              {metrics.map((metric, index) => (
                <li key={index} className="mb-2">
                  {metric.name} ({metric.type})
                </li>
              ))}
            </ul>

            <div className="mb-4">
              <label className="block mb-2">
                Choose a Metric to Sort (optional):
              </label>
              <select
                className="border p-2 mb-4 w-full"
                value={selectedMetricForSorting || ""}
                onChange={(e) =>
                  setSelectedMetricForSorting(e.target.value || null)
                }
              >
                <option value="">None</option>
                {metrics.map((metric) => (
                  <option key={metric.name} value={metric.name}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-green-500 text-white p-2 w-full"
              onClick={handleCreateLeaderboard}
            >
              Create Leaderboard
            </button>
          </div> */}
        </Modal>
      )}
    </div>
  );
};

export default GameCreationPage;
