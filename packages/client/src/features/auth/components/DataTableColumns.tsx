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
import { UserDeactivationForm } from "./UserDeactivationForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/trpc";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type AppUserColumn = {
  id: bigint;
  username: string;
  roles: string[];
  status: string;
};

export const columns: ColumnDef<AppUserColumn>[] = [
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
          table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())
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
    accessorKey: "id",
    header: "User ID",
    size: 100,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.username}</span>
    ),
    size: 1,
  },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) =>
      row.original.roles.map((role) => (
        <Badge key={row.id} variant="secondary">
          {role}
        </Badge>
      )),
    size: 0,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 180,
  },
  {
    id: "actions",
    size: 1,
    cell: ({ row }) => {
      const { toast } = useToast();
      const [dialogOpen, setDialogOpen] = useState(false);

      const { mutate: deactivateUser } = trpc.auth.deactivateUser.useMutation({
        onSuccess(data) {
          setDialogOpen(false);

          toast({
            variant: "default",
            description: data.message,
          });
        },
        onError(error) {
          alert(error.message);
        },
      });

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
              <DialogTrigger asChild>
                <DropdownMenuItem>Deactivate user</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserDeactivationForm
            user={row.original}
            onClick={() => {
              deactivateUser(row.original.id.toString());
            }}
          />
        </Dialog>
      );
    },
  },
];
