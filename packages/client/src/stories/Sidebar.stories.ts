import { Meta, StoryObj } from "@storybook/react";
import { mainMenus } from "./../layouts/MainMenus";
import Sidebar from "../components/Sidebar";
import { routeDecorator } from "../../.storybook/preview.tsx";

const meta = {
  title: "App/Sidebar",
  component: Sidebar,
  decorators: [routeDecorator],
} satisfies Meta<typeof Sidebar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    menus: mainMenus,
    title: "LNHS",
    subtitle: "SY. 2023-2024",
  },
};
