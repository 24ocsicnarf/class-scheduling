import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import {
  DataTableToolbar,
  DataTableToolbarProps,
} from "@/components/data-table/data-table-toolbar";
import { trpc } from "@/trpc";

export function SubjectDataTableToolbar<TData>({
  table,
  searchPlaceholder,
}: Omit<DataTableToolbarProps<TData>, "facetedFilterColumns">) {
  const categoriesQuery = trpc.subject.getCategories.useQuery();

  return (
    <DataTableToolbar
      table={table}
      searchPlaceholder={searchPlaceholder}
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
  );
}

const CategoriesFacetedFilter = ({ table }) => {
  return (
    <DataTableFacetedFilter
      key={faceted.columnId}
      column={table.getColumn(faceted.columnId)}
      title={faceted.title}
      options={faceted.data.map((item) => {
        return {
          label: item,
          value: item,
        };
      })}
    />
  );
};
