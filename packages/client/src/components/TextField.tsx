import { cva } from "class-variance-authority";
import { TextInput, TextInputProps } from "flowbite-react";

const TextField = (props: { Input: typeof TextInput }) => {
  return <TextInput {...defaultProps}></TextInput>;
};

export default TextField;
