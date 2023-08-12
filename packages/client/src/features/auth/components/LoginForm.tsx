import { useForm } from "react-hook-form";
import { trpc } from "../../../trpc";
// import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormData,
  LoginFormSchema,
} from "server/src/zodSchemas/LoginFormSchema";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

export const LoginForm = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { mutate: logIn } = trpc.auth.logIn.useMutation({
    onSuccess() {
      navigate("/dashboard");
    },
    onError(error) {
      alert(error.message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    logIn(data);
  };

  return (
    <div className="flex flex-col gap-12">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
        Class Scheduling System
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <Input {...register("username")} />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <PasswordInput {...register("password")} />
        </div>
        <div className="flex flex-col justify-stretch">
          <Button type="submit">Log in</Button>
        </div>
      </form>
      {/* <DevTool control={control} /> */}
    </div>
  );
};
