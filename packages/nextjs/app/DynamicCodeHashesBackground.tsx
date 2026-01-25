"use client";

import { useEffect, useState } from "react";

export const DynamicCodeHashesBackground = ({
  horizontalBg,
  verticalBg,
}: {
  horizontalBg: React.ReactNode;
  verticalBg: React.ReactNode;
}) => {
  const [isVertical, setIsVertical] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("codeDirection");
    if (stored === "vertical") {
      setIsVertical(true);
    }

    const handleDirectionChange = (event: CustomEvent) => {
      setIsVertical(event.detail.isVertical);
    };

    window.addEventListener("codeDirectionChange", handleDirectionChange as EventListener);
    return () => {
      window.removeEventListener("codeDirectionChange", handleDirectionChange as EventListener);
    };
  }, []);

  if (!mounted) return horizontalBg;

  return isVertical ? verticalBg : horizontalBg;
};
