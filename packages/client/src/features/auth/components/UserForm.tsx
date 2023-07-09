import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { MdPersonAdd } from "react-icons/md";

export type UserChangedEvent = (data: {
  message: string;
  status: number;
}) => void;

type UserFormEvent = {
  onUserChanged: UserChangedEvent;
};

export const UserForm = ({ onUserChanged }: UserFormEvent) => {
  const [open, setOpen] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const { mutate: addUser } = trpc.auth.addUser.useMutation({
    onSuccess(data) {
      toggleForm(false);
      onUserChanged(data);
    },
    onError(error) {
      alert(error.message);
    },
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      username: "",
      password: "",
      roleId: "",
    },
  });

  const onSubmit = (data: UserFormData) => {
    addUser(data);
  };

  const toggleForm = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={toggleForm}>
        <DialogTrigger asChild>
          <Button variant="default" className="flex flex-row gap-2">
            <MdPersonAdd />
            <span>Add user</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="pb-4">
                <DialogTitle>Add user</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="pb-4">
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
                    <FormItem className="pb-4">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                          <Input
                            {...field}
                            type={passwordShown ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setPasswordShown(!passwordShown);
                            }}
                          >
                            {passwordShown ? (
                              <BsFillEyeSlashFill />
                            ) : (
                              <BsFillEyeFill />
                            )}
                          </Button>
                        </div>
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
                  const { data, isLoading, error } =
                    trpc.auth.getUserRoles.useQuery();

                  return (
                    <FormItem className="pb-4">
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.map((role) => (
                            <SelectItem value={role.appRoleId.toString()}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <DevTool control={form.control} />
    </>
  );
};
