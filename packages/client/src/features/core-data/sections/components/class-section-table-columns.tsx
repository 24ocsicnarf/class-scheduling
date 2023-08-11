import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MdCircle, MdMenu } from "react-icons/md";
// import { SubjectArchivingDialog } from "../TeacherArchivingDialog";
import { useState, useRef, useEffect, useMemo } from "react";
import { FormResult } from "server/src/types/FormResult";

import { MasterDataView, ArchiveAction } from "@/types/master-data";
import { Badge } from "@/components/ui/badge";
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
        const [dialogOpen, setDialogOpen] = useState(false);
        const [selectedAction, setSelectedAction] = useState<
          "edit" | undefined
        >();

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
      },
    },
  ];
}
