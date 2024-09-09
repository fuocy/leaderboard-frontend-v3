import { useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export const games = [
  {
    name: "Game A",
    image:
      "https://jamango.io/stable/brownbricks/world_settings/389/thumbnails/original/tex-thumbnail-b7jly.png?1708540817",
  },
  {
    name: "Game B",
    image:
      "https://jamango.io/stable/brownbricks/world_settings/195/thumbnails/original/tex-thumbnail-ximka.png?1703255662",
  },
  {
    name: "Game C",
    image:
      "https://jamango.io/stable/brownbricks/world_settings/349/thumbnails/original/tex-thumbnail-kgqx9.png?1708541223",
  },
]; // Game names
interface FeatureGameListProps {
  navitageFromDashboard: string;
}
const FeatureGameList: React.FC<FeatureGameListProps> = ({
  navitageFromDashboard,
}) => {
  const navigate = useNavigate();
  return (
    <ul className="grid grid-cols-3 gap-6">
      {games.map((game) => (
        <li
          key={game.name}
          className="cursor-pointer hover:brightness-110 transition duration-300 pb-3"
          onClick={() => navigate(`/${navitageFromDashboard}/${game.name}`)}
        >
          <img
            src={game.image}
            alt="game backdrop"
            className="w-full h-[240px] object-cover rounded-2xl "
          />
          <h2 className="text-2xl tracking-wider mt-4 font-bold font-clashGrotesk">
            {game.name}
          </h2>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 items-center">
              <img
                src="https://jamango.io/stable/brownbricks/user_costumes/111/avatars/small/avatar.png?1720621792"
                alt="avatar creator"
                className="rounded-full w-[32px] h-[32px] object-cover object-top"
              />
              <p className="font-clashGrotesk text-gray-500">Fuocy</p>
            </div>
            <div className="flex items-center gap-1">
              <MdOutlineRemoveRedEye size={20} className="text-gray-700" />
              <p className="text-gray-700">1,5k</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FeatureGameList;
