import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseFormSubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectOnSuccess?: string;
  showShake?: boolean;
}

export function useFormSubmission<T extends FormData | Record<string, any>>(
  submitFn: (data: T) => Promise<{ error?: string; success?: boolean }>,
  options: UseFormSubmissionOptions = {}
) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const submit = useCallback(async (data: T) => {
    setLoading(true);
    setError(null);

    try {
      const result = await submitFn(data);

      if (result.error) {
        setError(result.error);
        if (options.showShake) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
        options.onError?.(result.error);
      } else {
        if (options.redirectOnSuccess) {
          router.push(options.redirectOnSuccess);
        }
        options.onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      if (options.showShake) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [submitFn, options, router]);

  return {
    loading,
    error,
    shake,
    submit,
    setError,
  };
}

