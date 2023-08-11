import { trpc } from "@/trpc";
import { MasterDataView } from "@/types/master-data";
import {
  SubjectColumn,
  getSubjectColumns,
} from "./table/subject-table-columns";
import { FormResult } from "server/src/types/FormResult";
import { DataTable } from "@/components/data-table";
import { useEffect } from "react";
import { useDataTable } from "@/components/hooks/use-data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

export const SubjectDataTable = ({
  subjectsView,
  categories,
  onFetchStatusChanged,
  onActionDialogOpened,
  onSaved,
}: {
  subjectsView: MasterDataView;
  categories: { subjectCategoryId: number; subjectCategoryName: string }[];
  onFetchStatusChanged: (
    status: "error" | "loading" | "success",
    error?: string
  ) => void;
  onActionDialogOpened: () => void;
  onSaved: (data: FormResult) => void;
}) => {
  const subjectsQuery = trpc.subject.getSubjects.useQuery({
    isArchived: subjectsView == MasterDataView.archived,
  });

  const columns = getSubjectColumns(
    onActionDialogOpened,
    onSaved,
    subjectsView
  );
  const [table] = useDataTable<SubjectColumn>();

  useEffect(() => {
    onFetchStatusChanged(subjectsQuery.status, subjectsQuery.error?.message);
  }, [subjectsQuery.status]);

  const categoriesQuery = trpc.subject.getCategories.useQuery(undefined);

  return (
    <>
      {subjectsQuery.status == "loading" ? (
        <div>Loading...</div>
      ) : subjectsQuery.status == "error" ? (
        <div>Error: {subjectsQuery.error.message}</div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between gap-2">
            <DataTableToolbar
              table={table}
              searchPlaceholder="Search subject..."
              facetedFilterColumns={facetedFilterColumns}
            />
          </div>
          <DataTable
            columns={getSubjectColumns(
              onActionDialogOpened,
              onSaved,
              subjectsView
            )}
            data={subjectsQuery.data!.map((subject) => {
              const subjectColumn: SubjectColumn = {
                id: subject.subjectId,
                name: subject.subjectName,
                shortName: subject.subjectShortName,
                colorHex: subject.colorHex,
                category: subject.subjectCategory.subjectCategoryName,
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
        </div>
      )}
    </>
  );
};
