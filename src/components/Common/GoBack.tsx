import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const GoBack = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex gap-2 items-center mb-10"
    >
      <IoMdArrowRoundBack size={30} className="text-orange-500 " />
      <p className="text-orange-500 text-lg font-medium">Back</p>
    </button>
  );
};

export default GoBack;
