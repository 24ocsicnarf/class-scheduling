import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { AppUserColumn } from "./DataTableColumns";

// import type { AppUser } from ".prisma/client";

export const UserDeactivationForm = ({
  user,
  onClick,
}: {
  user: AppUserColumn;
  onClick: React.FormEventHandler;
}) => {
  return (
    // <Dialog open={open} onOpenChange={setOpen}>
    //   <DialogTrigger asChild>
    //     <DropdownMenuItem>Deactivate user</DropdownMenuItem>
    //   </DialogTrigger>

    // </Dialog>

    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate {user.username}?</DialogTitle>
          <DialogDescription>
            This action does not delete the user's account. It will only tagged
            as 'inactive'
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onClick}>
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
