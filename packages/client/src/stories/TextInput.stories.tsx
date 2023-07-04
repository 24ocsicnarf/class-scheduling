import { Meta, StoryObj } from "@storybook/react";
import TextField from "../components/TextField";
import Button from "../components/Button";

const meta = {
  title: "App/TextField",
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = () => (
  <div className="flex gap-2">
    <TextField />
    <Button>Button</Button>
  </div>
);
