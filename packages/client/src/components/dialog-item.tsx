import React from "react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type DialogItemProps = {
  triggerChildren: string;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?(open: boolean): void;
};

const DialogItem = React.forwardRef(
  (props: DialogItemProps, forwardedRef: React.Ref<HTMLDivElement>) => {
    const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
      props;
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        {children}
      </Dialog>
    );
  }
);

export default DialogItem;
