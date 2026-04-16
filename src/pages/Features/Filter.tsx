import { useState } from "react";
import Label from "@/components/form/Label";

interface FilterProps {
  onChangeParam: (params: Record<string, any>) => void;
}

function FeatureFilter({ onChangeParam }: FilterProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onChangeParam({ filters: { search: e.target.value } });
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      <Label htmlFor="feature-search">Search Feature</Label>
      <input
        id="feature-search"
        type="text"
        value={search}
        onChange={handleSearch}
        className="border rounded px-3 py-2 w-64"
        placeholder="Search by feature name..."
      />
    </div>
  );
}

export default FeatureFilter;
