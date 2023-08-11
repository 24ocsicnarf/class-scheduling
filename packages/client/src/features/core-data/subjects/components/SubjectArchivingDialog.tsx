import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { trpc } from "@/trpc";
import { SubjectColumn } from "./table/subject-table-columns";
import { FormResult } from "server/src/types/FormResult";
import { ArchiveAction } from "@/types/master-data";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

export const SubjectArchivingDialog = ({
  subjects,
  action,
  onArchive,
  open,
  onOpenChange,
}: {
  subjects: SubjectColumn[];
  action: ArchiveAction;
  onArchive: (data: FormResult) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  console.log("rendered");

  const { mutate: toggleSubjects } = trpc.subject.toggleSubjects.useMutation({
    onSuccess(data) {
      onOpenChange && onOpenChange(false);
      onArchive(data);
    },
    onError(error) {
      alert(error.message);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action == ArchiveAction.archive ? "Archive" : "Unarchive"}{" "}
            {subjects.length == 1 ? ` subject` : `${subjects.length} subjects`}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action does not delete{" "}
            {subjects.length == 1
              ? `'${subjects[0].name}' subject`
              : `${subjects.length} subjects`}
            . {subjects.length == 1 ? "It" : "They"} will be only tagged as
            'inactive'
          </AlertDialogDescription>
        </AlertDialogHeader>
        {subjects.length > 1 && (
          <>
            <h4 className="text-sm font-medium leading-none">
              Subjects selected to be{" "}
              {action == ArchiveAction.archive ? "archived" : "unarchived"}:
            </h4>
            <ScrollArea className="max-h-[200px] rounded-md mb-4" type="always">
              <ol className="list-decimal list-inside px-4">
                {subjects.map((subject) => (
                  <li key={subject.id.toString()} className="text-sm break-all">
                    {subject.name}
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </>
        )}
        <AlertDialogFooter className="gap-1.5">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                toggleSubjects({
                  subjectIds: subjects.map((subject) => subject.id.toString()),
                  isArchived: action == ArchiveAction.archive,
                });
              }}
            >
              {action == ArchiveAction.archive ? "Archive" : "Unarchive"}{" "}
              {subjects.length > 1 && `${subjects.length} subjects`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
