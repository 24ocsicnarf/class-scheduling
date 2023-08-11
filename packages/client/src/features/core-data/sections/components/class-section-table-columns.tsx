/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { SubjectArchivingDialog } from "../TeacherArchivingDialog";
import { useState } from "react";
import { FormResult } from "server/src/types/FormResult";

import { MasterDataView } from "@/types/master-data";
import { EditSeniorHighSectionFormDialog } from "./SeniorHighSectionForm";

export type SeniorHighSectionColumn = {
  id: number;
  fullSectionName: string;
};

export function getSeniorHighSectionColumns(
  onDialogOpened: () => void,
  onMutated: (data: FormResult) => void,
  view: MasterDataView
): ColumnDef<SeniorHighSectionColumn>[] {
  return [
    {
      id: "fullSectionName",
      header: "Section",
      cell: ({ row }) => (
        <p className="font-bold">{`${row.original.fullSectionName}`}</p>
      ),
      size: 0,
    },
    {
      id: "actions",
      size: 1,
      cell: ({ row }) => {
        return (
          <ClassSectionActionDialog
            row={row}
            view={view}
            onDialogOpened={onDialogOpened}
            onMutated={onMutated}
          />
        );
      },
    },
  ];
}

const ClassSectionActionDialog = ({
  row,
  view,
  onDialogOpened,
  onMutated,
}: {
  row: Row<SeniorHighSectionColumn>;
  view: MasterDataView;
  onDialogOpened: () => void;
  onMutated: (data: FormResult) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"edit" | undefined>();

  function handleDialogOpenChange(open: boolean) {
    if (open) {
      onDialogOpened();
    }

    setDialogOpen(open);
  }

  function handleSelectedAction(action: typeof selectedAction) {
    if (action != undefined) {
      setDialogOpen(true);
    }

    setSelectedAction(action);
  }

  return (
    <div className={`flex gap-2`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {view == MasterDataView.available ? (
            <>
              <DropdownMenuItem
                onSelect={async () => {
                  handleSelectedAction("edit");
                }}
              >
                Edit
              </DropdownMenuItem>
            </>
          ) : (
            <></>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedAction == "edit" && (
        <EditSeniorHighSectionFormDialog
          shsSectionId={row.original.id}
          onSaved={onMutated}
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
};
