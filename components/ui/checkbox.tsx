"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, onChange, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="flex items-center space-x-3 group">
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            className={cn(
              "peer h-5 w-5 rounded-md border-2 border-border/60 bg-surface appearance-none cursor-pointer transition-all duration-200",
              "hover:border-primary/50 hover:bg-surface-muted",
              "checked:bg-primary checked:border-primary checked:shadow-md",
              "focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            onChange={onChange}
            {...props}
          />
          <svg
            className="absolute left-0 top-0 h-5 w-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-all duration-200 scale-0 peer-checked:scale-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              className="text-white"
            />
          </svg>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none cursor-pointer select-none text-foreground group-hover:text-foreground transition-colors"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

