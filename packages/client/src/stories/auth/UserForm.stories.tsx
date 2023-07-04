import { Meta } from "@storybook/react";
import { UserForm } from "../../features/auth/components/UserForm";

const meta = {
  title: "Auth/UserForm",
  component: UserForm,
} satisfies Meta<typeof UserForm>;
export default meta;

export const Default = () => <UserForm />;
