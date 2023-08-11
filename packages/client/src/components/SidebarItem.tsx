import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  path: string;
}

const SidebarItemIcon: React.FC<{ as?: IconType; isSelected: boolean }> = ({
  as: Icon = "MdOutlineSquare",
  isSelected,
}) => {
  return (
    <Icon
      className={`flex-none h-6 w-6 mx-1 origin-left ${
        isSelected ? "text-blue-50" : "text-gray-950"
      }`}
    />
  );
};

const SidebarItem = (props: SidebarItemProps) => {
  const isSelected = props.selected ?? false;

  return (
    <NavLink
      to={props.path}
      className={`flex items-center rounded-md ${
        isSelected ? "bg-blue-500" : "bg-transparent hover:bg-gray-100"
      } p-2 w-full`}
    >
      <SidebarItemIcon as={props.icon} isSelected={isSelected} />
      <p
        className={`origin-left whitespace-nowrap overflow-hidden mx-2 ${
          isSelected ? "text-blue-50" : "text-gray-950"
        } ${!open && "w-0"}`}
      >
        {props.label}
      </p>
    </NavLink>
  );
};

export default SidebarItem;
