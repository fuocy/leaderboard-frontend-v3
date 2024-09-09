import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Metric {
  name: string;
  type: "text" | "number";
}

interface Leaderboard {
  game: string;
  name: string;
  metrics: Metric[];
  sorting: {
    metric: string;
    order: Order;
  } | null;
}
type Order = "asc" | "desc";

interface LeaderboadFormProps {
  gameName: string | undefined;
  onClose: () => void;
}

const LeaderboardForm: React.FC<LeaderboadFormProps> = ({
  gameName,
  onClose,
}) => {
  const [leaderboardName, setLeaderboardName] = useState("");

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [metricName, setMetricName] = useState<string>("");
  const [metricType, setMetricType] = useState<"text" | "number">("text");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedMetricForSorting, setSelectedMetricForSorting] = useState<
    string | null
  >(null);
  const queryClient = useQueryClient();

  const handleEditMetric = (index: number) => {
    setEditIndex(index);
    setMetricName(metrics[index].name);
    setMetricType(metrics[index].type);
  };

  const handleDeleteMetric = (index: number) => {
    const updatedMetrics = metrics.filter((_, i) => i !== index);
    setMetrics(updatedMetrics);
  };

  const handleAddMetric = () => {
    if (metricName.trim().length === 0) {
      alert("Metric name can't be blank");
      return;
    }

    if (editIndex !== null) {
      const updatedMetrics = [...metrics];
      updatedMetrics[editIndex] = { name: metricName, type: metricType };
      setMetrics(updatedMetrics);
      setEditIndex(null);
    } else {
      setMetrics([...metrics, { name: metricName, type: metricType }]);
    }
    setMetricName("");
    setMetricType("text");
  };

  const createLeaderboardMutation = useMutation<unknown, unknown, Leaderboard>({
    mutationFn: (newLeaderboard) =>
      axios.post(
        "http://localhost:5000/api/leaderboards/create",
        newLeaderboard
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards", gameName] }),
  });

  const handleCreateLeaderboard = () => {
    if (leaderboardName.trim()) {
      const sorting = selectedMetricForSorting
        ? { metric: selectedMetricForSorting, order: "desc" as Order }
        : null; // Default to 'desc' order for the selected metric

      createLeaderboardMutation.mutate({
        game: gameName!,
        name: leaderboardName,
        metrics,
        sorting,
      });

      onClose();
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editIndex]);

  return (
    <div className="flex-1 bg-gray-100 rounded-2xl shadow-lg px-8 py-6">
      <h2 className="text-3xl font-bold mb-7">Create Leaderboard</h2>
      <div className="relative mb-8">
        <input
          className=" rounded p-3 w-full outline-none focus:border-orange-400 border-2"
          type="text"
          placeholder="Leaderboard Name"
          value={leaderboardName}
          onChange={(e) => setLeaderboardName(e.target.value)}
        />
      </div>

      <div className="mb-3 flex flex-col md:gap-2 md:flex-row">
        <div className="relative flex-grow">
          <input
            className="rounded p-3 w-full focus:border-orange-400 border-2 outline-none"
            type="text"
            placeholder="Metric Name"
            ref={inputRef}
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
          />
        </div>

        <select
          className="rounded p-3 outline-none focus:border-orange-400 border-2"
          value={metricType}
          onChange={(e) => setMetricType(e.target.value as "text" | "number")}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
        </select>
        {editIndex === null ? (
          <button
            onClick={handleAddMetric}
            className="bg-orange-500 px-4 py-3 text-white rounded shadow-sm hover:brightness-110 transition duration-300 active:translate-y-0.5"
          >
            Add Metric
          </button>
        ) : (
          <button
            onClick={handleAddMetric}
            className="bg-blue-500 px-4 text-white rounded shadow-sm hover:brightness-110 transition duration-300 active:translate-y-0.5"
          >
            Update Metric
          </button>
        )}
      </div>

      <ul className="mb-4">
        {metrics.map((metric, index) => (
          <li
            key={index}
            className="p-4 mb-2 border rounded-lg flex items-center justify-between bg-white shadow-xs"
          >
            <div className="flex-1">
              <input
                className="border-none bg-transparent text-lg font-medium"
                type="text"
                value={metric.name}
                readOnly
              />
              <span className="text-gray-600"> ({metric.type})</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditMetric(index)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMetric(index)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <label className="block mb-2 font-clashGrotesk text-lg ">
          Sorting metric: (only support numeric metrics!)
        </label>
        <select
          className="mb-4 rounded p-3 w-full focus:border-orange-400 border-2 outline-none"
          value={selectedMetricForSorting || ""}
          onChange={(e) => setSelectedMetricForSorting(e.target.value || null)}
        >
          <option value="" className="py-3">
            None
          </option>
          {metrics
            .filter((metric) => metric.type === "number")
            .map((metric) => (
              <option key={metric.name} value={metric.name} className="py-3">
                {metric.name}
              </option>
            ))}
        </select>
      </div>
      <button
        onClick={handleCreateLeaderboard}
        className="p-3 text-xl bg-orange-500 hover:brightness-110 transition duration-300 text-white rounded w-full active:translate-y-0.5"
      >
        Create Leaderboard
      </button>
    </div>
  );
};

export default LeaderboardForm;
