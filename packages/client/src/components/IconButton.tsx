import { MdAdd } from "react-icons/md";

const IconButton = () => {
  return (
    <button className="bg-transparent hover:bg-gray-100 active:bg-gray-200 rounded-full">
      <MdAdd className="w-6 h-6 m-2 text-slate-500" />
    </button>
  );
};

export default IconButton;
