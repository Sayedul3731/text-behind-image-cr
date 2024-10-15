"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  placeholder: string;
  attribute: string;
  label: string;
  currentValue: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  attribute,
  currentValue,
  handleAttributeChange,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleAttributeChange(attribute, value);
  };
  console.log("current value", currentValue);
  return (
    <div className="flex flex-col items-start">
      <Input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleInputChange}
        className="bg-black border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default InputField;
