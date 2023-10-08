import * as React from "react";
import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryString } from "@/hooks/use-create-query-string";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { DataTableFilterableColumn } from "@/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useQueryString();

  const isFiltered = table.getState().columnFilters.length > 0;
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInputValue = useDebounce(inputValue, 500); // Debounce the input value

  React.useEffect(() => {
    const newQueryString = createQueryString({
      page: null,
      searchText: debouncedInputValue || null,
    });

    router.push(
      `${pathname}?${createQueryString({
        page: 1,
        searchText: debouncedInputValue || null,
      })}`
    );
  }, [debouncedInputValue]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search feedback"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("statusName") && (
          <DataTableFacetedFilter
            column={table.getColumn("statusName")}
            title="Status"
            options={statuses}
          />
        )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.title}
                  options={column.options}
                />
              )
          )}
        {(isFiltered || inputValue != "") && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setInputValue("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
