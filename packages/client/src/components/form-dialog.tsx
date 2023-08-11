import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

// FormDialog.displayName = Dialog.displayName;

// const FormDialogContent = React.forwardRef<
//   React.ElementRef<FormDialogContentProps>,
//   React.ComponentPropsWithoutRef<FormDialogContentProps>
// >(({ children, ...props }, _) => {
//   return (
//     <Form {...props}>
//       <form>
//         <fieldset className="group space-y-6">{children}</fieldset>
//         <div className="space-x-3 text-right">
//           <DialogClose asChild>
//             <Button variant="secondary" aria-label="close">
//               Cancel
//             </Button>
//           </DialogClose>
//           <Button type="submit" disabled={!props.formState.isDirty}>
//             Save
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// });

const FormContent = <T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  onCancel,
  children,
}: {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onCancel?: () => void;
} & React.PropsWithChildren) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
        <div className="space-x-3 text-right">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

const FormDialog = ({
  title,
  triggerChild,
  children,
  open,
  onOpenChange,
}: {
  title: string;
  triggerChild?: JSX.Element;
  children: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerChild && <DialogTrigger asChild>{triggerChild}</DialogTrigger>}
      <DialogContent
        className="w-96 md:max-w-md focus-visible:outline-none gap-4"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export { FormDialog, FormContent };
