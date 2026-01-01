"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  label: string;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, label, className }: RadioGroupItemProps) {
  const { value: selectedValue, onValueChange } = React.useContext(RadioGroupContext);
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  const isSelected = selectedValue === value;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <input
        type="radio"
        id={radioId}
        value={value}
        checked={isSelected}
        onChange={() => onValueChange?.(value)}
        className="h-4 w-4 cursor-pointer border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
      />
      <label
        htmlFor={radioId}
        className="text-sm font-medium leading-none cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
}








