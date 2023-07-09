import {
  MdAccountCircle,
  MdCalendarMonth,
  MdDashboard,
  MdGroupWork,
  MdSubject,
  MdKey,
} from "react-icons/md";
import { FaChalkboardTeacher, FaUserCog } from "react-icons/fa";
import { IconType } from "react-icons";
import DashboardPage from "@/pages/DashboardPage";
import ClassSchedulingPage from "@/pages/ClassSchedulingPage";
import SectionsPage from "@/pages/SectionsPage";
import SubjectsPage from "@/pages/SubjectsPage";
import TeachersPage from "@/pages/TeachersPage";
import UsersPage from "@/pages/UsersPage";
import UserRolesPage from "@/pages/UserRolesPage";
import RolePermissionsPage from "@/pages/RolePermissionsPage";

export type MainMenu = {
  icon: IconType;
  label: string;
  path: string;
  page: JSX.Element;
};

export const mainMenus: MainMenu[] = [
  {
    icon: MdDashboard,
    label: "Dashboard",
    path: "/dashboard",
    page: <DashboardPage />,
  },
  {
    icon: MdCalendarMonth,
    label: "Class Scheduling",
    path: "/class-scheduling",
    page: <ClassSchedulingPage />,
  },
  {
    icon: MdGroupWork,
    label: "Sections",
    path: "/sections",
    page: <SectionsPage />,
  },
  {
    icon: MdSubject,
    label: "Subjects",
    path: "/subjects",
    page: <SubjectsPage />,
  },
  {
    icon: FaChalkboardTeacher,
    label: "Teachers",
    path: "/teachers",
    page: <TeachersPage />,
  },
  {
    icon: MdAccountCircle,
    label: "Users",
    path: "/users",
    page: <UsersPage />,
  },
  {
    icon: FaUserCog,
    label: "User Roles",
    path: "/user-roles",
    page: <UserRolesPage />,
  },
  {
    icon: MdKey,
    label: "Permissions",
    path: "/role-permissions",
    page: <RolePermissionsPage />,
  },
];
