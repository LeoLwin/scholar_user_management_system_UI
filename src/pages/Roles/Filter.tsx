import { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface queryParamType {
  [key: string]: any;
}
interface FilterType<T> {
  onChangeParam: (queryParams: queryParamType) => void;
}
function Filter<T>({ onChangeParam }: FilterType<T>) {
  const [filters, setFilter] = useState<queryParamType>({});
  const [filtersData, setFilterData] = useState<queryParamType>({});

  useEffect(() => {
    onChangeParam({ page: 1, filters: filtersData });
  }, [filtersData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filters, [name]: value });
  };

  const searchData = () => {
    const filterArr = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    setFilterData(filterArr);
  };

  const clearSearch = () => {
    setFilter({});
    setFilterData({});
  };

  return (
    <>
      <div className="space-y-6 mb-5">
        <ComponentCard title="Filter">
          <div className="flex flex-wrap gap-3">
            <div className="w-full md:w-1/3">
              <Label htmlFor="input">Role's Name</Label>
              <Input
                type="text"
                id="input"
                name="name"
                placeholder="Search Role Name"
                value={filters.name || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="me-3"
              onClick={clearSearch}
            >
              Clear
            </Button>
            <Button size="sm" className="" onClick={searchData}>
              Search
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

export default Filter;
