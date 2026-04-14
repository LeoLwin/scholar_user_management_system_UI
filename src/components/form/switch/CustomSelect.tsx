import Select, { MultiValue, SingleValue,StylesConfig,GroupBase } from "react-select";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
type Option = {
  label: string | number;
  value: string | number;
};

interface Props {
  options: Option[];
  value: Option | null | Option[];
  onChange: (value: Option | null | Option[]) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  isMulti?: boolean;
}
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className="w-full text-sm",
  size = "md",
  isDisabled = false,
  isMulti = false,
}: Props) => {
  const { theme } = useTheme();
  const [ themeMode, setThemeMode ] = useState<string>();
  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  const sizes = {
    sm: "36px",
    md: "44px",
    lg: "40px",
  };

  const styles : StylesConfig<Option, boolean, GroupBase<Option>>= {
    input: (base) => ({
      ...base,
      color: (themeMode === 'dark') ? "#fff" : "#000",
    }),
    control: (base, state) => ({
      ...base,
      minHeight: sizes[size],
      backgroundColor: (themeMode === 'dark') ? "#0f172a" : "#ffffff",
      borderColor: state.isFocused
        ? "#f96622"
        : (themeMode === 'dark')
        ? "#374151"
        : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 0.1px #f96622" : "none",
      "&:hover": {
        borderColor: "#f96622",
      },
      opacity: isDisabled ? 0.6 : 1,
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: (themeMode === 'dark') ? "#0f172a" : "#ffffff",
      border: (themeMode === 'dark') ? "1px solid #f96622" : "1px solid #e5e7eb",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#f96622"
        : state.isFocused
        ? (themeMode === 'dark')
          ? "#1e293b"
          : "#f3f4f6"
        : "transparent",
      color: state.isSelected ? "#ffffff" : (themeMode === 'dark') ? "#e5e7eb" : "#111827",
      cursor: "pointer",
    }),

    singleValue: (base) => ({
      ...base,
      color: (themeMode === 'dark') ? "#e5e7eb" : "#111827",
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: "#f96622", // orange background
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: (themeMode === 'dark') ? "#ffffff" : "#111827",
    }), 

    placeholder: (base) => ({
      ...base,
      color: (themeMode === 'dark') ? "#94a3b8" : "#6b7280",
    }),
  };

  return (
    <Select
    isMulti={isMulti}
    options={options}
    value={value}
    onChange={(newValue) => {
      if (isMulti) {
        onChange([...newValue as MultiValue<Option>]);
      } else {
        onChange(newValue as SingleValue<Option>);
      }
    }}
    placeholder={placeholder}
    styles={styles}
    isDisabled={isDisabled}
    className={className}
  />
  );
};

export default CustomSelect;