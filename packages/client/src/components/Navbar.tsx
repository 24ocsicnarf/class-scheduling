import { useNavigate } from "react-router-dom";
import { trpc } from "@/trpc";

const Navbar = () => {
  const navigate = useNavigate();

  const { mutate: logOut } = trpc.auth.logOut.useMutation({
    onSuccess() {
      navigate("/login");
    },
    onError() {
      alert(
        "Error logging out... 'di ka na makakalabas no escape dito ka na habambuhay akin ka lang oliver HAHHAHHHAHA"
      );
    },
  });

  return (
    <div className="sticky top-0 h-20 p-4 shadow bg-white flex justify-between items-center z-10">
      <div></div>
      <ul className="items-end flex gap-4">
        <li>
          <a>hihi</a>
        </li>
        <li>
          <button type="button" onClick={() => logOut()}>
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
