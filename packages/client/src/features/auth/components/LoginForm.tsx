import { useForm } from "react-hook-form";
import { trpc } from "../../../trpc";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormData,
  LoginFormSchema,
} from "server/src/zodSchemas/LoginFormSchema";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  const navigate = useNavigate();

  const { register, control, handleSubmit } = useForm<LoginFormData>({
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <Input {...register("username")} placeholder="Enter username" />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <Input
            type="password"
            {...register("password")}
            placeholder="Enter password"
          />
        </div>
        <div className="flex flex-col justify-stretch">
          <Button type="submit">Log in</Button>
        </div>
      </form>
      <DevTool control={control} />
    </>
  );
};
