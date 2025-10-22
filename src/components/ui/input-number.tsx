import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface InputNumberProps {
  className?: string;
  value?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function InputNumber({
  value,
  min,
  max,
  onChange,
  ...props
}: InputNumberProps) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() ?? "");

  useEffect(() => {
    setInputValue(value?.toString() ?? "");
  }, [value]);

  const clampValue = (num: number): number => {
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return num;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const num = Number(val);
    if (!isNaN(num)) {
      onChange(clampValue(num));
    }
  };

  const handleBlur = () => {
    const num = Number(inputValue);
    if (!isNaN(num)) {
      const clamped = clampValue(num);
      setInputValue(clamped.toString());
      onChange(clamped);
    } else {
      if (min !== undefined) {
        setInputValue(min.toString());
        onChange(min);
      } else {
        setInputValue("");
      }
    }
  };

  return (
    <Input
      {...props}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
