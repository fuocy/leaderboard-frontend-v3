import FeatureGameList from "../../components/Common/FeatureGameList";
import GoBack from "../../components/Common/GoBack";

const CreatorDashboard = () => {
  return (
    <div className="p-8">
      <GoBack />
      <h1 className="text-4xl mb-6 font-commando upperacse">Featured Games</h1>
      <FeatureGameList navitageFromDashboard="creator-dashboard" />
    </div>
  );
};

export default CreatorDashboard;
