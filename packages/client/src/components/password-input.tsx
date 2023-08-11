import * as React from "react";

import { cn } from "@/lib/utils";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Toggle } from "./ui/toggle";
import { Input } from "./ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [passwordShown, setPasswordShown] = React.useState(false);

    return (
      <div
        className={cn(
          "flex items-center h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <Input
          type={passwordShown ? "text" : "password"}
          className="w-full text-sm border-0 bg-transparent focus-within:focus:ring-0 focus-within:focus:ring-offset-0"
          ref={ref}
          placeholder={passwordShown ? "(password shown)" : undefined}
          {...props}
        />
        <Toggle
          title={passwordShown ? "Hide password" : "Show password"}
          size="sm"
          className="w-10 rounded-sm me-[0.5px]"
          onClick={() => {
            setPasswordShown(!passwordShown);
          }}
        >
          {passwordShown ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
        </Toggle>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
