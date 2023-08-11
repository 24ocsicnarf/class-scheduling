import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export const DialogButton = ({
  triggerChildren,
  children,
  onOpenChange,
}: {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onOpenChange?(open: boolean): void;
}) => {
  return (
    <>
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
        {children}
      </Dialog>
    </>
  );
};
