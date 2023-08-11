import { Fragment, useState } from "react";
import { MdCircle, MdDashboard, MdMenuOpen } from "react-icons/md";
import { FaSchool } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";
import { MenuSection } from "../layouts/MainMenus";

interface SidebarProps {
  menuSections: MenuSection[];
  title: string;
  subtitle: string;
}

const Sidebar = (props: SidebarProps) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState("duration-0");

  return (
    <div
      className={`h-screen sticky top-0 w-20 ${
        expanded && "lg:w-64"
      } ${transitionDuration} flex flex-col z-20 bg-white drop-shadow`}
      onTransitionEnd={() => setTransitionDuration("duration-0")}
    >
      {/* Sidebar Header */}
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
            className={`rounded-md bg-transparent hover:bg-gray-100 max-lg:hidden ${
              expanded ? "rotate-0" : "rotate-180"
            } ${transitionDuration}`}
            onClick={() => {
              setExpanded(!expanded);
              setTransitionDuration("duration-300");
            }}
          >
            <MdMenuOpen className={`h-6 w-6 m-2 text-gray-500`} />
          </button>
          <div className="lg:hidden flex items-center justify-center border border-gray-300 rounded-md w-10 h-10 flex-none">
            <FaSchool className={`h-5 w-5 text-gray-500`} />
          </div>
        </div>
      </div>
      {/* Sidebar Menu */}
      <div
        className={`grow overflow-y-scroll overflow-x-hidden ${transitionDuration}`}
      >
        <div className="flex flex-col gap-1 ps-4 py-4">
          {props.menuSections.map((section, index) => {
            return (
              <Fragment key={section.title ?? "_"}>
                {section.title && (
                  <span
                    className="uppercase text-muted-foreground text-xs px-1 pt-3 pb-1 truncate"
                    title={section.title}
                  >
                    {section.title}
                  </span>
                )}
                {section.menus.map((menu, index) => {
                  return (
                    <SidebarItem
                      key={menu.path}
                      icon={menu.icon}
                      label={menu.label}
                      selected={location.pathname == menu.path}
                      path={menu.path}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
