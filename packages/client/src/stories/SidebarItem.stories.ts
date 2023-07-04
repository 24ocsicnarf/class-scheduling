import { routeDecorator } from "./../../.storybook/preview.tsx";
import { Meta, StoryObj } from "@storybook/react";
import SidebarItem from "../components/SidebarItem";
import { MdCircle, MdDashboard } from "react-icons/md";

const meta = {
  title: "App/SidebarItem",
  component: SidebarItem,
  argTypes: {},
  decorators: [routeDecorator],
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: MdCircle,
    label: "Default",
    selected: false,
    path: "/",
  },
};
