import { useState } from "react";
import { MdCircle, MdDashboard, MdMenuOpen } from "react-icons/md";
import { FaSchool } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";
import { MainMenu } from "../layouts/MainMenus";
import { Disclosure } from "@headlessui/react";

interface SidebarProps {
  menus: MainMenu[];
  title: string;
  subtitle: string;
}

const Sidebar = (props: SidebarProps) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState("duration-0");

  return (
    <div
      className={`flex flex-col w-20 ${
        expanded ? "md:w-64" : "w-20"
      } ${transitionDuration} h-screen z-10 bg-white drop-shadow-lg`}
      onTransitionEnd={() => setTransitionDuration("duration-0")}
    >
      <div className="flex items-center">
        <div className={`flex items-center flex-1 origin-left overflow-hidden`}>
          <div className="flex items-center justify-center border border-gray-300 rounded-md ms-5 me-2 w-10 h-10 flex-none">
            <FaSchool className={`h-5 w-5 text-gray-500`} />
          </div>
          <div className={`flex flex-col`}>
            <p
              className="min-h-[1.5rem] text-base text-ellipsis whitespace-nowrap align-baseline overflow-hidden w-24"
              title="Limay National High School"
            >
              {props.title}
            </p>
            <p className="min-h-[1rem] text-xs text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden w-24">
              {props.subtitle}
            </p>
          </div>
        </div>
        <div className="flex-none origin-right m-5 w-10 h-10">
          <button
            className="rounded-md bg-transparent hover:bg-gray-100 max-md:hidden"
            onClick={() => {
              setExpanded(!expanded);
              setTransitionDuration("duration-300");
            }}
          >
            <MdMenuOpen className={`h-6 w-6 m-2 text-gray-500`} />
          </button>
          <div className="md:hidden flex items-center justify-center border border-gray-300 rounded-md w-10 h-10 flex-none">
            <FaSchool className={`h-5 w-5 text-gray-500`} />
          </div>
        </div>
      </div>
      {/* Sidebar Menu */}
      <div
        className={`grow overflow-y-hidden hover:overflow-y-auto ${
          expanded
            ? "pe-6 max-md:pe-4 hover:pe-2 max-md:hover:pe-0"
            : "pe-4 hover:pe-0"
        } ${transitionDuration}`}
      >
        <ul className="flex flex-col gap-2 ps-4 py-4">
          {props.menus.map((menu, index) => {
            return (
              <SidebarItem
                key={index}
                icon={menu.icon}
                label={menu.label}
                selected={location.pathname == menu.path}
                path={menu.path}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
