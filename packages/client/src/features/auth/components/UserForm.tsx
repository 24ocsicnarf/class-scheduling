import { Input } from "@/components/ui/input";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserFormData,
  UserFormSchema,
} from "server/src/zodSchemas/UserFormSchema";
import { trpc } from "@/trpc";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PasswordInput } from "@/components/password-input";

import { FormContent } from "@/components/form-dialog";
import { FormResult } from "server/src/types/FormResult";
import { useFormDialog } from "@/components/hooks/use-form-dialog";
import { UserStatus } from "server/src/types/UserStatus";

export const UserForm = ({
  roles,
  onSaved,
  onCancel,
}: {
  roles: { appRoleId: number; appRoleName: string }[];
  onSaved: (data: FormResult) => void;
  onCancel?: () => void;
}) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
  });

  const [setError] = useFormDialog(form);

  const trpcUtils = trpc.useContext();

  const { mutate: addUser } = trpc.auth.addUser.useMutation({
    onSuccess(data) {
      trpcUtils.auth.getUsers.invalidate(UserStatus.active);

      onSaved(data);
      form.reset();
    },
    onError(error, variables) {
      setError(error, variables);
    },
  });

  const onSubmit = (data: UserFormData) => {
    addUser(data);
  };

  return (
    <>
      <FormContent form={form} onSubmit={onSubmit} onCancel={onCancel}>
        <fieldset
          className="group space-y-6"
          disabled={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <div>
                <FormItem className="">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => {
              return (
                <FormItem className="">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.map((role) => (
                        <SelectItem value={role.appRoleId.toString()}>
                          {role.appRoleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </fieldset>
      </FormContent>
      {/* <DevTool control={form.control} /> */}
    </>
  );
};
