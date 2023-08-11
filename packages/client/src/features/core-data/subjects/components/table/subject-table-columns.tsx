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
import { MdCircle, MdEdit, MdMenu } from "react-icons/md";
import { SubjectArchivingDialog } from "../SubjectArchivingDialog";
import { useState, useRef, useEffect, useMemo } from "react";
import { EditSubjectFormDialog, SubjectForm } from "../forms/SubjectForm";
import { FormResult } from "server/src/types/FormResult";

import { MasterDataView, ArchiveAction } from "@/types/master-data";
import { Badge } from "@/components/ui/badge";

export type SubjectColumn = {
  id: number;
  name: string;
  shortName: string;
  category: string;
  colorHex: string;
  isArchived: boolean;
};

export function getSubjectColumns(
  onDialogOpened: () => void,
  onMutated: (data: FormResult) => void,
  view: MasterDataView
): ColumnDef<SubjectColumn>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsSomeRowsSelected()
              ? "indeterminate"
              : table.getIsAllRowsSelected()
          }
          onCheckedChange={() =>
            table.toggleAllPageRowsSelected(
              !table.getIsAllPageRowsSelected() &&
                !table.getIsSomePageRowsSelected()
            )
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 1,
    },
    {
      accessorKey: "colorHex",
      header: ({ table }) => {
        const [dialogOpen, setDialogOpen] = useState(false);
        const [selectedAction, setSelectedAction] = useState<
          "archive" | "unarchive" | "delete" | undefined
        >();

        function handleModalOpenChange(open: boolean) {
          if (open) {
            onDialogOpened();
          }

          if (!open) {
            setSelectedAction(undefined);
          }
        }

        function handleSelectedAction(action: typeof selectedAction) {
          if (action != undefined) {
            setDialogOpen(true);
          }

          setSelectedAction(action);
        }

        return (
          <div className="relative w-[36px]">
            {(table.getIsSomeRowsSelected() ||
              table.getIsAllRowsSelected()) && (
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm" className="drop-shadow">
                      <MdMenu />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      {table.getSelectedRowModel().rows.length} selected
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {view == MasterDataView.available ? (
                      <DropdownMenuItem
                        onSelect={() => {
                          handleSelectedAction("archive");
                        }}
                      >
                        Archive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onSelect={() => {
                          handleSelectedAction("unarchive");
                        }}
                      >
                        Unarchive
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onSelect={() => {
                        handleSelectedAction("delete");
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {selectedAction == "archive" && (
              <SubjectArchivingDialog
                subjects={table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original)}
                action={ArchiveAction.archive}
                onArchive={onMutated}
                open={dialogOpen}
                onOpenChange={handleModalOpenChange}
              />
            )}
            {selectedAction == "unarchive" && (
              <SubjectArchivingDialog
                subjects={table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original)}
                action={ArchiveAction.unarchive}
                onArchive={onMutated}
                open={dialogOpen}
                onOpenChange={handleModalOpenChange}
              />
            )}
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="ps-4">
          <MdCircle
            className="flex justify-center text-xl"
            style={{ color: row.original.colorHex }}
          />
        </div>
      ),
      size: 1,
    },
    {
      accessorKey: "name",
      header: "Subject name",
      cell: ({ row }) => (
        <p className="font-bold max-w-prose truncate" title={row.original.name}>
          {row.original.name}
        </p>
      ),
      size: 1,
    },
    {
      accessorKey: "shortName",
      header: "Short name",
      cell: ({ row }) => (
        <p className="min-w-[120px]">{row.original.shortName}</p>
      ),
      size: 1,
    },
    {
      accessorKey: "category",
      enableGlobalFilter: false,
      header: "Category",
      cell: ({ row }) => (
        <Badge key={row.id} variant="secondary" className="rounded-sm">
          {row.original.category}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 0,
    },
    {
      id: "actions",
      size: 1,
      cell: ({ row }) => {
        // TODO: zustand to the rescue para i-track kung may napiling item na ie-edit at idi-disable lahat ng actions habang nagloload

        // TODO: BAKIT 4 times 'to nagre-render???
        console.log("rendered");

        const [dialogOpen, setDialogOpen] = useState(false);
        const [selectedAction, setSelectedAction] = useState<
          "edit" | "archive" | "unarchive" | "delete" | undefined
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        handleSelectedAction("archive");
                      }}
                    >
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        handleSelectedAction("delete");
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onSelect={() => {
                      handleSelectedAction("unarchive");
                    }}
                  >
                    Unarchive
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedAction == "edit" && (
              <EditSubjectFormDialog
                subjectId={row.original.id}
                onSaved={onMutated}
                open={dialogOpen}
                onOpenChange={handleDialogOpenChange}
              />
            )}

            {selectedAction == "archive" && (
              <SubjectArchivingDialog
                subjects={[row.original]}
                action={ArchiveAction.archive}
                onArchive={onMutated}
                open={dialogOpen}
                onOpenChange={handleDialogOpenChange}
              />
            )}

            {selectedAction == "unarchive" && (
              <SubjectArchivingDialog
                subjects={[row.original]}
                action={ArchiveAction.unarchive}
                onArchive={onMutated}
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
