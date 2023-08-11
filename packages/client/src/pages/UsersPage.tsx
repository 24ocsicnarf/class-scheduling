import {
  AppUserColumn,
  getAppUserColumns,
} from "@/features/auth/components/table/user-columns";
import { DataTable } from "@/components/data-table";
import { trpc } from "@/trpc";
import { UserForm } from "@/features/auth/components/UserForm";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import { FormResult } from "server/src/types/FormResult";
import { UserStatus } from "server/src/types/UserStatus";
import { FormDialog } from "@/components/form-dialog";
import { MdPersonAdd } from "react-icons/md";

export enum UsersView {
  active,
  inactive,
}

const UsersPage = () => {
  const [usersView, setUsersView] = useState(UsersView.active);

  const [dialogOpen, setDialogOpen] = useState(false);

  const usersQuery = trpc.auth.getUsers.useQuery(
    usersView == UsersView.active ? UserStatus.active : UserStatus.inactive
  );

  // HACK: 2 BESES NAGRE-RENDER :(
  console.log(usersView);

  const rolesQuery = trpc.auth.getAppRoles.useQuery();

  const mappedData = usersQuery.data?.map((user) => {
    const userColumn: AppUserColumn = {
      id: user.appUserId,
      username: user.username,
      userRoles: user.appUserRoles.map((r) => r.appRole.appRoleName).join(";"),
      status: user.userStatus,
    };

    return userColumn;
  });

  const onUserChanged = async (data: FormResult) => {
    toast({
      title: data.title,
      description: data.message,
    });
  };

  return (
    <div className="container p-6">
      <div className="flex flex-row justify-between h-16 pb-6">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-3xl font-bold">Users</h1>
          {usersQuery.isLoading ? (
            <></>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {usersView == UsersView.active ? (
                      <FaUserCheck />
                    ) : (
                      <FaUserSlash />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={UsersView[usersView]}
                    onValueChange={(value) =>
                      setUsersView(UsersView[value as keyof typeof UsersView])
                    }
                  >
                    <DropdownMenuRadioItem value={UsersView[UsersView.active]}>
                      Active users
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value={UsersView[UsersView.inactive]}
                    >
                      Inactive users
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {usersView == UsersView.inactive && (
                <Badge className="rounded-md" variant="default">
                  Inactive users
                </Badge>
              )}
            </>
          )}
        </div>
        <div className="flex flex-row gap-3">
          {usersView == UsersView.active && (
            <>
              {usersQuery.isLoading ? (
                <></>
              ) : (
                <FormDialog
                  title="Add User"
                  triggerChild={
                    <Button className="flex flex-row gap-2">
                      <MdPersonAdd />
                      <span>Add user</span>
                    </Button>
                  }
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                >
                  <UserForm
                    roles={rolesQuery.data ?? []}
                    onSaved={onUserChanged}
                    onCancel={() => setDialogOpen(false)}
                  />
                </FormDialog>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {usersQuery.isLoading ? (
          <div>Loading...</div>
        ) : usersQuery.error || usersQuery.data == null ? (
          <div>Error: {usersQuery.error.message}</div>
        ) : (
          <DataTable
            columns={getAppUserColumns(onUserChanged, usersView)}
            data={mappedData ?? []}
            view={usersView}
            searchPlaceholder="Search username..."
            facetedFilterColumns={[
              {
                columnId: "userRoles",
                title: "Role",
                data: rolesQuery.data?.map((role) => role.appRoleName) ?? [],
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
