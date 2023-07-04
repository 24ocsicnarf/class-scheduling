import { Meta, StoryObj } from "@storybook/react";
import Navbar from "client/src/components/Navbar";
import { routeDecorator, trpcDecorator } from "../../.storybook/preview.tsx";

const meta = {
  title: "App/Navbar",
  component: Navbar,
  decorators: [trpcDecorator, routeDecorator],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navbar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
