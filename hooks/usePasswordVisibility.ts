import { useState } from "react";

/**
 * Custom hook for managing password visibility toggle
 */
export function usePasswordVisibility(initialState: boolean = false) {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = () => setIsVisible((prev) => !prev);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    toggle,
    show,
    hide,
  };
}

