import { useState, useCallback } from "react";
import { useCopyToClipboard } from "./useCopyToClipboard";

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export function useShare() {
  const { copy, copiedField } = useCopyToClipboard();
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(async (options: ShareOptions) => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
      } else {
        await copy(options.url, "share");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to share:", err);
        throw err;
      }
    } finally {
      setIsSharing(false);
    }
  }, [copy]);

  return {
    share,
    isSharing,
    copiedField,
  };
}

