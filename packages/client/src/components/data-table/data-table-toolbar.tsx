import { RxCross2 } from "react-icons/rx";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState, useTransition } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  facetedFilterColumns?: { columnId: string; title: string; data: string[] }[];
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  facetedFilterColumns,
}: DataTableToolbarProps<TData>) {
  const [query, setQuery] = useState("");

  const [, startTransition] = useTransition();

  const isFiltered =
    query ||
    table.getFilteredRowModel().rows.length !=
      table.getPreFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder ?? "Search..."}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);

            startTransition(() => {
              table.setGlobalFilter(event.target.value);
            });
          }}
          className="h-8 w-[180px] lg:w-[240px]"
        />
        {facetedFilterColumns?.map((faceted) => {
          return (
            table.getColumn(faceted.columnId) && (
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
            )
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetGlobalFilter();
              setQuery("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <RxCross2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
