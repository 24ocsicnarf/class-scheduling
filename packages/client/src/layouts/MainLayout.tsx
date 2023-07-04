import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { mainMenus } from "./MainMenus";

const MainLayout = () => {
  return (
    <div className="flex justify-center">
      <div className="flex w-screen max-w-[1920px] overflow-clip">
        <Sidebar menus={mainMenus} title="LNHS" subtitle="S.Y. 2023-2024" />
        <div className="flex-grow overflow-auto flex flex-col h-screen">
          <div className="grow min-w-[540px] flex flex-col">
            <Navbar />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
//  justify-center
export default MainLayout;
