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
import { EditTeacherFormDialog } from "./TeacherForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type TeacherColumn = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  honorific: string;
  nickname: string;
};

export function getTeacherColumns(
  onDialogOpened: () => void,
  onMutated: (data: FormResult) => void,
  view: MasterDataView
): ColumnDef<TeacherColumn>[] {
  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsSomeRowsSelected()
    //           ? "indeterminate"
    //           : table.getIsAllRowsSelected()
    //       }
    //       onCheckedChange={() =>
    //         table.toggleAllPageRowsSelected(
    //           !table.getIsAllPageRowsSelected() &&
    //             !table.getIsSomePageRowsSelected()
    //         )
    //       }
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 1,
    // },
    {
      id: "avatar",
      cell: ({ row }) => (
        <Avatar>
          <AvatarFallback>
            {row.original.firstName[0]}
            {row.original.lastName[0]}
          </AvatarFallback>
        </Avatar>
      ),
      size: 1,
    },
    {
      // TODO: EXTEND THIS FULL NAME SA PRISMA COMPUTED FIELDS
      accessorKey: "firstName",
      id: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <p className="font-bold">
          {`${row.original.firstName} ${row.original.middleName} ${row.original.lastName} ${row.original.suffix}`.replaceAll(
            "  ",
            " "
          )}
        </p>
      ),
      size: 0,
    },
    {
      id: "nickname",
      cell: ({ row }) => (
        <p className="max-w-prose truncate">
          {row.original.honorific} {row.original.nickname}
        </p>
      ),
      size: 1,
    },
    {
      id: "actions",
      size: 1,
      cell: ({ row }) => {
        return (
          <TeacherActionDialog
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

const TeacherActionDialog = ({
  row,
  view,
  onDialogOpened,
  onMutated,
}: {
  row: Row<TeacherColumn>;
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
        <EditTeacherFormDialog
          teacherId={row.original.id}
          onSaved={onMutated}
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
};
