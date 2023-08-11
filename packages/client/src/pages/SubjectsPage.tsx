import { trpc } from "@/trpc";
import { toast } from "@/components/ui/use-toast";
import { useRef, useState } from "react";
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
import { MdAdd, MdArchive, MdSubject } from "react-icons/md";
import {
  SubjectColumn,
  getSubjectColumns,
} from "@/features/core-data/subjects/components/table/subject-table-columns";
import { DataTable } from "@/components/data-table";
import { SubjectForm } from "@/features/core-data/subjects/components/forms/SubjectForm";
import { FormResult } from "server/src/types/FormResult";

import { MasterDataView } from "@/types/master-data";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FormDialog } from "@/components/form-dialog";
import { SubjectCategory } from "server/src/db/prisma";

const SubjectsPage = () => {
  const onSavedToast = useRef<ReturnType<typeof toast> | null>(null);

  const [subjectsView, setSubjectsView] = useState(MasterDataView.available);

  const subjectsQuery = trpc.subject.getSubjects.useQuery({
    isArchived: subjectsView == MasterDataView.archived,
  });

  const categoriesQuery = trpc.subject.getCategories.useQuery(undefined);

  const handleSavedSubject = async (data: FormResult) => {
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
          <h1 className="text-3xl font-bold">Subjects</h1>
          {subjectsQuery.isLoading ? (
            <></>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {subjectsView == MasterDataView.available ? (
                      <MdSubject />
                    ) : (
                      <MdArchive />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={MasterDataView[subjectsView]}
                    onValueChange={(value) => {
                      setSubjectsView(
                        MasterDataView[value as keyof typeof MasterDataView]
                      );
                    }}
                  >
                    <DropdownMenuRadioItem
                      value={MasterDataView[MasterDataView.available]}
                    >
                      Available subjects
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value={MasterDataView[MasterDataView.archived]}
                    >
                      Archived subjects
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <>
                {" "}
                {subjectsView == MasterDataView.archived && (
                  <Badge className="rounded-md" variant="default">
                    Archived subjects
                  </Badge>
                )}
              </>
            </>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {subjectsQuery.data && (
            <>
              {subjectsView == MasterDataView.available && (
                <SubjectFormDialog
                  categories={categoriesQuery.data ?? []}
                  onOpened={handleDialogOpened}
                  onSaved={handleSavedSubject}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {/* TODO: GAWAN NG BAGONG COMPONENT  */}
        {subjectsQuery.isLoading ? (
          <div>Loading...</div>
        ) : subjectsQuery.error || subjectsQuery.data == null ? (
          <div>Error: {subjectsQuery.error.message}</div>
        ) : (
          <DataTable
            columns={getSubjectColumns(
              handleDialogOpened,
              handleSavedSubject,
              subjectsView
            )}
            data={subjectsQuery.data.map((subject) => {
              const subjectColumn: SubjectColumn = {
                id: subject.subjectId,
                name: subject.subjectName,
                shortName: subject.subjectShortName,
                colorHex: subject.colorHex,
                category: subject.subjectCategory.subjectCategoryName,
                isArchived: subject.isArchived,
              };

              return subjectColumn;
            })}
            view={subjectsView}
            searchPlaceholder="Search subject..."
            facetedFilterColumns={[
              {
                columnId: "category",
                title: "Category",
                data:
                  categoriesQuery.data?.map(
                    (category) => category.subjectCategoryName
                  ) ?? [],
              },
            ]}
          />
        )}
      </div>
      {/* <ReactQueryDevtools /> */}
    </div>
  );
};

export default SubjectsPage;

const SubjectFormDialog = ({
  categories,
  onOpened,
  onSaved,
}: {
  categories: SubjectCategory[];
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
      title="Add Subject"
      triggerChild={
        <Button className="flex flex-row gap-2">
          <MdAdd />
          <span>Add subject</span>
        </Button>
      }
      open={dialogOpen}
      onOpenChange={handleDialogOpen}
    >
      <SubjectForm
        categories={categories}
        onSaved={(data) => {
          setDialogOpen(false);
          onSaved && onSaved(data);
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </FormDialog>
  );
};
