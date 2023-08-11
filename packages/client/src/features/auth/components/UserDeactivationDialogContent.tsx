import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AppUserColumn } from "@/features/auth/components/table/user-columns";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { trpc } from "@/trpc";
import { FormResult } from "server/src/types/FormResult";

// import type { AppUser } from ".prisma/client";

export const UserDeactivationDialogContent = ({
  users,
  onDeactivate,
}: {
  users: AppUserColumn[];
  onDeactivate: (data: FormResult) => void;
}) => {
  const trpcUtils = trpc.useContext();
  const { mutate: deactivateUsers } = trpc.auth.deactivateUsers.useMutation({
    onSuccess(data) {
      onDeactivate(data);
      trpcUtils.auth.getUsers.invalidate("inactive");
    },
    onError(error) {
      alert(error.message);
    },
  });

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Deactivate{" "}
            {users.length == 1 ? users[0].username : `${users.length} users`}?
          </DialogTitle>
          <DialogDescription>
            This action does not delete{" "}
            {users.length == 1 ? users[0].username : `${users.length} users`}.{" "}
            {users.length == 1 ? "It" : "They"} will be only tagged as
            'inactive'
          </DialogDescription>
        </DialogHeader>
        {users.length > 1 && (
          <>
            <h4 className="text-sm font-medium leading-none">
              Users selected to deactivate:
            </h4>
            <ScrollArea className="max-h-[200px] rounded-md mb-4" type="always">
              <ol className="list-decimal list-inside px-4">
                {users.map((user) => (
                  <li key={user.id.toString()} className="text-sm break-all">
                    {user.username}
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </>
        )}
        <DialogFooter>
          <DialogPrimitive.Close asChild>
            <Button variant="secondary">
              Cancel
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
          <Button
            type="button"
            onClick={() => deactivateUsers(users.map((user) => user.id))}
          >
            Deactivate {users.length > 1 && `all ${users.length} users`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
