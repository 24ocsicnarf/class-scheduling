import { trpc } from "@/trpc";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

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
import { MdAdd, MdArchive } from "react-icons/md";

import { DataTable } from "@/components/data-table";
import { FormResult } from "server/src/types/FormResult";

import { MasterDataView } from "@/types/master-data";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FormDialog } from "@/components/form-dialog";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  TeacherColumn,
  getTeacherColumns,
} from "@/features/core-data/teachers/components/teacher-table-columns";
import { TeacherForm } from "@/features/core-data/teachers/components/TeacherForm";

const TeachersPage = () => {
  const onSavedToast = useRef<ReturnType<typeof toast> | null>(null);

  const [teachersView, setTeachersView] = useState(MasterDataView.available);

  const teachersQuery = trpc.teacher.getTeachers.useQuery({
    isArchived: teachersView == MasterDataView.archived,
  });

  const handleSaved = async (data: FormResult) => {
    onSavedToast.current = toast({
      title: data.title,
      description: data.message,
    });
  };

  function handleDialogOpened() {
    onSavedToast.current && onSavedToast.current.dismiss();
    onSavedToast.current = null;
  }

  return (
    <div className={`container p-6`}>
      <div className="flex flex-row justify-between h-16 pb-6">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-3xl font-bold">Teachers</h1>
          {teachersQuery.isLoading ? (
            <></>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {teachersView == MasterDataView.available ? (
                      <FaChalkboardTeacher />
                    ) : (
                      <MdArchive />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={MasterDataView[teachersView]}
                    onValueChange={(value) => {
                      setTeachersView(
                        MasterDataView[value as keyof typeof MasterDataView]
                      );
                    }}
                  >
                    <DropdownMenuRadioItem
                      value={MasterDataView[MasterDataView.available]}
                    >
                      Active teachers
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value={MasterDataView[MasterDataView.archived]}
                    >
                      Inactive teachers
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <>
                {" "}
                {teachersView == MasterDataView.archived && (
                  <Badge className="rounded-md" variant="default">
                    Inactive teachers
                  </Badge>
                )}
              </>
            </>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {teachersQuery.data && (
            <>
              {teachersView == MasterDataView.available && (
                <TeacherFormDialog
                  onOpened={handleDialogOpened}
                  onSaved={handleSaved}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {teachersQuery.isLoading ? (
          <div>Loading...</div>
        ) : teachersQuery.error || teachersQuery.data == null ? (
          <div>Error: {teachersQuery.error.message}</div>
        ) : (
          <DataTable
            columns={getTeacherColumns(
              handleDialogOpened,
              handleSaved,
              teachersView
            )}
            data={teachersQuery.data.map((teacher) => {
              const teacherColumn: TeacherColumn = {
                id: teacher.teacherId,
                firstName: teacher.firstName,
                middleName: teacher.middleName ?? "",
                lastName: teacher.lastName,
                suffix: teacher.nameSuffix ?? "",
                nickname: teacher.nickname,
                honorific: teacher.shortHonorific ?? "",
              };

              return teacherColumn;
            })}
            view={teachersView}
            searchPlaceholder="Search teacher..."
            facetedFilterColumns={[]}
          />
        )}
      </div>
      {/* <ReactQueryDevtools /> */}
    </div>
  );
};

export default TeachersPage;

const TeacherFormDialog = ({
  onOpened,
  onSaved,
}: {
  onOpened?: () => void;
  onSaved?: (data: FormResult) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDialogOpen(open: boolean) {
    setDialogOpen(open);

    if (open) {
      onOpened && onOpened();
    }
  }

  return (
    <FormDialog
      title="Add Teacher"
      triggerChild={
        <Button className="flex flex-row gap-2">
          <MdAdd />
          <span>Add teacher</span>
        </Button>
      }
      open={dialogOpen}
      onOpenChange={handleDialogOpen}
    >
      <TeacherForm
        onSaved={(data) => {
          setDialogOpen(false);
          onSaved && onSaved(data);
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </FormDialog>
  );
};
