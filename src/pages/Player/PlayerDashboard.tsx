import GoBack from "../../components/Common/GoBack";
import FeatureGameList from "../../components/Common/FeatureGameList";

const PlayerDashboard = () => {
  return (
    <div className="p-8">
      <GoBack />
      <h1 className="text-4xl mb-6 font-commando upperacse">Feature Games</h1>
      <FeatureGameList navitageFromDashboard="player-dashboard" />
    </div>
  );
};

export default PlayerDashboard;
