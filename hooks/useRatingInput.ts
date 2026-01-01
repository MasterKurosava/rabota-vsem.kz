import { useState, useCallback } from "react";

export function useRatingInput(initialRating: number = 5) {
  const [rating, setRating] = useState(initialRating);

  const setRatingValue = useCallback((value: number) => {
    if (value >= 1 && value <= 5) {
      setRating(value);
    }
  }, []);

  const reset = useCallback(() => {
    setRating(initialRating);
  }, [initialRating]);

  return {
    rating,
    setRating: setRatingValue,
    reset,
  };
}

