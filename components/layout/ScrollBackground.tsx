"use client";

import { useEffect, useState } from "react";

export function ScrollBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(3000);

  useEffect(() => {
    // Make body background transparent so dynamic background is visible
    document.body.style.backgroundColor = "transparent";
    
    // Calculate document height for better color transitions
    const updateDocumentHeight = () => {
      setDocumentHeight(
        Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )
      );
    };

    updateDocumentHeight();
    window.addEventListener("resize", updateDocumentHeight);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDocumentHeight);
      // Restore original background on unmount
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Calculate background color based on scroll position
  // Smooth transition between different shades of blue
  const getBackgroundColor = () => {
    const maxScroll = documentHeight * 0.8; // Use 80% of document height
    const scrollProgress = Math.min(scrollY / maxScroll, 1);

    // Color stops: light blue -> medium blue -> deep blue -> light blue
    if (scrollProgress < 0.25) {
      // First quarter: light blue-gray to medium blue
      const t = scrollProgress / 0.25;
      return `rgb(${Math.round(250 - 15 * t)} ${Math.round(250 - 20 * t)} ${Math.round(252 + 3 * t)})`;
    } else if (scrollProgress < 0.5) {
      // Second quarter: medium blue to deeper blue
      const t = (scrollProgress - 0.25) / 0.25;
      return `rgb(${Math.round(235 - 20 * t)} ${Math.round(230 - 25 * t)} ${Math.round(255 - 10 * t)})`;
    } else if (scrollProgress < 0.75) {
      // Third quarter: deeper blue to light blue
      const t = (scrollProgress - 0.5) / 0.25;
      return `rgb(${Math.round(215 + 25 * t)} ${Math.round(205 + 30 * t)} ${Math.round(245 + 5 * t)})`;
    } else {
      // Last quarter: light blue back to starting light blue
      const t = (scrollProgress - 0.75) / 0.25;
      return `rgb(${Math.round(240 + 10 * t)} ${Math.round(235 + 15 * t)} ${Math.round(250 + 2 * t)})`;
    }
  };

  const darkModeGetBackgroundColor = () => {
    const maxScroll = documentHeight * 0.8;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);

    // Dark mode color stops: dark blue shades only
    if (scrollProgress < 0.25) {
      // First quarter: dark blue-gray to medium dark blue
      const t = scrollProgress / 0.25;
      return `rgb(${Math.round(17 + 10 * t)} ${Math.round(24 + 15 * t)} ${Math.round(39 + 20 * t)})`;
    } else if (scrollProgress < 0.5) {
      // Second quarter: medium dark blue to deeper blue
      const t = (scrollProgress - 0.25) / 0.25;
      return `rgb(${Math.round(27 + 15 * t)} ${Math.round(39 + 20 * t)} ${Math.round(59 + 25 * t)})`;
    } else if (scrollProgress < 0.75) {
      // Third quarter: deeper blue to medium dark blue
      const t = (scrollProgress - 0.5) / 0.25;
      return `rgb(${Math.round(42 - 10 * t)} ${Math.round(59 - 15 * t)} ${Math.round(84 - 20 * t)})`;
    } else {
      // Last quarter: medium dark blue back to starting dark blue
      const t = (scrollProgress - 0.75) / 0.25;
      return `rgb(${Math.round(32 - 15 * t)} ${Math.round(44 - 20 * t)} ${Math.round(64 - 25 * t)})`;
    }
  };

  return (
    <>
      {/* Light mode background */}
      <div
        className="fixed inset-0 -z-10 transition-colors duration-300 ease-out dark:hidden"
        style={{
          backgroundColor: getBackgroundColor(),
        }}
      />
      {/* Dark mode background */}
      <div
        className="fixed inset-0 -z-10 hidden transition-colors duration-300 ease-out dark:block"
        style={{
          backgroundColor: darkModeGetBackgroundColor(),
        }}
      />
    </>
  );
}

