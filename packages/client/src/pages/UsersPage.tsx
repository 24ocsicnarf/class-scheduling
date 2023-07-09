import {
  AppUserColumn,
  columns,
} from "@/features/auth/components/DataTableColumns";
import { DataTable } from "@/features/auth/components/DataTable";
import { trpc } from "@/trpc";
import {
  UserChangedEvent,
  UserForm,
} from "@/features/auth/components/UserForm";
import { useToast } from "@/components/ui/use-toast";

const UsersPage = () => {
  const { toast } = useToast();
  const { data, isLoading, error, refetch } =
    trpc.auth.getActiveUsers.useQuery();

  if (isLoading) {
    return <div>"Loading..."</div>;
  }

  if (error || data == undefined) {
    return <div>{error.message}</div>;
  }

  const onUserChanged: UserChangedEvent = (data) => {
    toast({
      variant: "default",
      description: data.message,
    });

    refetch();
  };

  const mappedData = data.map((user) => {
    const userColumn: AppUserColumn = {
      id: user.appUserId,
      username: user.username,
      roles: user.appUserRoles.map((r) => r.appRole.name),
      status: user.userStatus,
    };

    return userColumn;
  });

  return (
    <div className="container p-6">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold pb-4">Users</h1>
        <div className="flex flex-row gap-3">
          <UserForm onUserChanged={onUserChanged} />
        </div>
      </div>
      <div className="">
        <DataTable
          columns={columns}
          data={mappedData}
          onUserChanged={onUserChanged}
        />
      </div>
    </div>
  );
};

export default UsersPage;
