import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { sidebarMenus } from "./MainMenus";

const MainLayout = () => {
  return (
    <div className="flex">
      <aside>
        <Sidebar
          menuSections={sidebarMenus}
          title="ISCP"
          subtitle="S.Y. 2023-2024"
        />
      </aside>
      <div className="flex-grow flex flex-col overflow-x-hidden">
        <nav className="sticky top-0">
          <Navbar />
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
