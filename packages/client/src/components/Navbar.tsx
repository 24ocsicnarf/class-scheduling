import { useNavigate } from "react-router-dom";
import { trpc } from "@/trpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const navigate = useNavigate();

  const { mutate: logOut } = trpc.auth.logOut.useMutation({
    onSuccess() {
      navigate("/login");
    },
    onError() {
      alert("Error logging out...");
    },
  });

  return (
    <div className="h-20 p-4 z-10 drop-shadow-sm bg-background flex justify-between items-center">
      <div></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex gap-4">
            {currentUser?.username}
            <Avatar>
              <AvatarFallback>
                {currentUser?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>LNHS</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => logOut()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
