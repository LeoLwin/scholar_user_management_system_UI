import { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface queryParamType {
  [key: string]: unknown;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FilterType {
  onChangeParam: (queryParams: queryParamType) => void;
}
function FeatureFilter({ onChangeParam }: FilterType) {
  const [filters, setFilter] = useState<Record<string, string | number | undefined>>({});
  const [filtersData, setFilterData] = useState<queryParamType>({});

  useEffect(() => {
    onChangeParam({ page: 1, filters: filtersData });
  }, [filtersData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Filter input changed:", name, value);
    setFilter({ ...filters, [name]: value });
  };

  const searchData = () => {
    console.log("Applying filters:", filters);
    const filterArr = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    console.log("Filtered parameters to apply:", filterArr);
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
              <Label htmlFor="input">Feature Name</Label>
              <Input
                type="text"
                id="input"
                name="name"
                placeholder="Search Feature Name"
                value={filters.name || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={searchData} className="mr-2">Search</Button>
            <Button onClick={clearSearch} variant="outline">Clear</Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

export default FeatureFilter;
