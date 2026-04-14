import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
// import Select from "../form/Select";
// import Select from "react-select";
// import { selectStyles } from "@/components/ui/selectStyles";
import CustomSelect from "../form/switch/CustomSelect";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

type orderType = "asc" | "desc";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

interface queryParamType {
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: orderType;
  [key: string]: unknown;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortCols?: string[];
  defaultSortBy?: string;
  defaultSortOrder?: orderType;
  isPagination?: boolean;
  onChangeParam: (queryParams: queryParamType) => void;
  totalEntries: number;
  totalPages: number;
  page: number;
  loading?: boolean;
}

const options = [
  { value: 5, label: "5" },
  { value: 10, label: "10 " },
  { value: 20, label: "20 " },
  { value: 50, label: "50 " },
];


export default function DataTable<T>({ columns, data, sortCols, defaultSortBy="id", defaultSortOrder="desc", isPagination = false, onChangeParam, totalEntries, totalPages, page, loading = true }: DataTableProps<T>) {
  
  const [queryParams, setQueryParams] = useState<queryParamType>({
    page: 1,
    per_page: (isPagination)? 10 : page,
    sort_by: defaultSortBy != ""? defaultSortBy: 'id', // id
    sort_order: defaultSortOrder
  });

  const [sortBy, setSortBy] = useState<string>(queryParams.sort_by);
  const [sortOrder, setSortOrder] = useState<orderType>(queryParams.sort_order);
  const [perPage, setPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState<T[]>([]);
  const [startIndex, setStartIndex] =  useState<number>(0);
  const [endIndex, setEndIndex] =  useState<number>(0);

  // initial state data 
  useEffect(() => {
    setCurrentData(data);
    if( !isPagination ){
      setPerPage(totalEntries);
    }
    setEndIndex(Math.min(Number(startIndex) + Number(perPage), totalEntries));
  }, [data, isPagination]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // change queryParamas state when update perpage , sortBy and sortOrder
  // call API when update queryParams
  useEffect(() => {
    setQueryParams({
      page: currentPage,
      per_page: perPage,
      sort_by: sortBy || queryParams.sort_by || "",
      sort_order: sortOrder || "asc"
    });
  }, [perPage , sortBy, sortOrder, currentPage]);

  // update queryParam for Parent Component
  useEffect(() => {
    onChangeParam(queryParams);
  }, [queryParams]);

  useEffect(()=>{console.log("currentData:", currentData  )},[currentData])

  // Column  Sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // CurrentPage set to 1 when change select show page 
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, isPagination]);

  // update show Data Record depend on change pagination change
  useEffect(() => {
    changeShowData();
  }, [startIndex, currentPage, perPage, isPagination]);

  const changeShowData = () => {
    if( isPagination ){
      setStartIndex ((currentPage - 1) * perPage);
      // console.log('startIndex', startIndex);
      // console.log('perPage', perPage);
      // console.log('perPage1', startIndex + perPage);
      // console.log(Math.min(startIndex + perPage, totalEntries));
      setEndIndex(Math.min(Number(startIndex) + Number(perPage), totalEntries));
    }else{
      setStartIndex (0);
      setEndIndex (totalEntries);
      setCurrentData(data);
    }
  }

  // const changePerPage = (value: number) => {
  //   setPerPage(value);
  // }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    } else if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }else {
      return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }
  };

  const visiblePages = getVisiblePages();

  return(
    <>
    { isPagination && (
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
          <CustomSelect
            options={options}
            value = {{value:perPage || 10, label: perPage || "10"}}
            className="w-25 text-sm dark:bg-dark-900"
            onChange={(v: unknown) =>
              setPerPage((v as { value: number }).value)
            }
          /> 
          <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
        </div>
      </div>
    )}  
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <Table>
          {/* Bind Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns && 
              columns.map((column, colIndex) => {
                const isSortable = sortCols?.includes(column.key);
                const isActive = sortBy === column.key;
                return (
                  <TableCell
                  key={colIndex}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center justify-center text-theme-m dark:text-gray-400"
                  >
                    <div
                      onClick={() => isSortable && handleSort(column.key)}
                      className={`flex ${ (column.key === 'action')? 'items-center justify-center':'items-start' } ${
                        isSortable ? "cursor-pointer" : ""
                      }`}
                    >
                      <span className="pe-2">{column.header}</span>

                      {isSortable && (
                        <span className="flex justify-end">
                          <span className={`${
                              isActive && sortOrder === "asc"
                                ? "text-brand-500 dark:text-brand-500"
                                : "text-brand-100 dark:text-white"
                            }`}> ↑ </span>
                          <span className={`${
                            isActive && sortOrder === "desc"
                              ? "text-brand-500 dark:text-brand-500"
                              : "text-brand-100 dark:text-white"
                          }`}>↓</span>
                        </span>
                      )}
                    </div>
                  </TableCell>
                  )
                }
              )}
            </TableRow>
          </TableHeader>

          {/* Bind Table Data */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  {loading ? "Loading ....": "No records found"}
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns &&
                    columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      >
                        {column.render(row)}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}

          </TableBody>
        </Table>
      </div>

      {(currentData.length > 0 ) &&
        ( <div className="flex items-center justify-between mt-4 text-sm mb-4">
          {/* Show Reccord Information */}
          { ( isPagination && perPage !== undefined ) && (
          <div className="flex items-center space-x-4">
            <div className="text-gray-600 ml-5 dark:text-gray-400">
              <div>
                Showing{" "}
                <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{totalEntries}</span> entries
              </div>
            </div>
          </div>
          )}
          {/* Show Pagination */}
          { ( isPagination && perPage !== undefined ) && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-1 text-sm rounded-md border ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-brand-500"
                } dark:text-gray-400`}
              >
                Prev
              </Button>

              {visiblePages.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    size="sm"
                    variant={`${
                      currentPage === page
                        ? "primary" : "outline"}`}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-4 py-1 text-sm rounded-md border transition-colors duration-150 ${
                      currentPage === page
                        ? "bg-brand-500 text-white border-brand-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
    
              <Button
                size="sm"
                variant="outline"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-1 text-sm rounded-md border ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </Button>
            </div>
          )
        }
        </div>
      )}
    </div>
    </>
  )
}
