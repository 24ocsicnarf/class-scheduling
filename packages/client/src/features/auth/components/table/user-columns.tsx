import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDeactivationDialogContent } from "../UserDeactivationDialogContent";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { trpc } from "@/trpc";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserReactivationForm } from "../UserReactivationForm";
import { MdMenu } from "react-icons/md";
import DialogItem from "@/components/dialog-item";
import { FormResult } from "server/src/types/FormResult";
import { UsersView } from "@/pages/UsersPage";
import { UserStatus } from "server/src/types/UserStatus";

export type AppUserColumn = {
  id: number;
  username: string;
  userRoles: string;
  status: string;
};

export function getAppUserColumns(
  onDataChanged: (data: FormResult) => void,
  view: UsersView
): ColumnDef<AppUserColumn>[] {
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
      size: 48,
    },
    {
      accessorKey: "username",
      header: ({ table }) => {
        return (
          <div className="relative">
            {(table.getIsSomeRowsSelected() ||
              table.getIsAllRowsSelected()) && (
              <div className="absolute top-1/2 transform -translate-y-1/2">
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
                    <DialogItem triggerChildren="Deactivate">
                      <UserDeactivationDialogContent
                        users={table
                          .getSelectedRowModel()
                          .rows.map((row) => row.original)}
                        onDeactivate={onDataChanged}
                      />
                    </DialogItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <span>Username</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <p
          className="font-bold max-w-xs truncate"
          title={row.original.username}
        >
          {row.original.username}
        </p>
      ),
      maxSize: 320,
    },
    {
      accessorKey: "userRoles",
      enableGlobalFilter: false,
      header: "Role",
      cell: ({ row }) =>
        row.original.userRoles.split(";").map((userRole) => (
          <Badge key={row.id} variant="secondary" className="rounded-sm">
            {userRole}
          </Badge>
        )),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 0,
    },
    {
      accessorKey: "status",
      enableGlobalFilter: false,
      header: "Status",
      cell: ({ row }) => (
        <Badge
          key={row.id}
          variant="outline"
          className={
            row.original.status == UserStatus.active
              ? "border-green-300"
              : "font-normal"
          }
        >
          {row.original.status}
        </Badge>
      ),
      size: 180,
    },
    {
      id: "actions",
      size: 1,
      cell: ({ row }) => {
        console.log("rendered");
        const [dialogOpen, setDialogOpen] = useState(false);

        function handleUpdate(data: FormResult) {
          setDialogOpen(false);
          onDataChanged(data);
        }

        return (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{row.original.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Change role</DropdownMenuItem>
                <DropdownMenuItem>Reset password</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  {view == UsersView.active ? (
                    <DropdownMenuItem>Deactivate user</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>Reactivate user</DropdownMenuItem>
                  )}
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            {view == UsersView.active ? (
              <UserDeactivationDialogContent
                users={[row.original]}
                onDeactivate={handleUpdate}
              />
            ) : (
              <UserReactivationForm
                users={[row.original]}
                onReactivate={handleUpdate}
              />
            )}
          </Dialog>
        );
      },
    },
  ];
}
