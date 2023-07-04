import { Meta, StoryObj } from "@storybook/react";
import IconButton from "./../components/IconButton";

const meta = {
  title: "App/IconButton",
  component: IconButton,
} satisfies Meta<typeof IconButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = () => <IconButton />;
