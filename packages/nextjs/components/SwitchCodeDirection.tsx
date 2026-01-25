"use client";

import { useEffect, useState } from "react";

export const SwitchCodeDirection = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsVertical(localStorage.getItem("codeDirection") === "vertical");
  }, []);

  const toggle = () => {
    const val = !isVertical;
    setIsVertical(val);
    localStorage.setItem("codeDirection", val ? "vertical" : "horizontal");
    window.dispatchEvent(new CustomEvent("codeDirectionChange", { detail: { isVertical: val } }));
  };

  if (!mounted) return null;

  return (
    <div className={`flex h-7 items-center justify-center ${className}`}>
      <button
        onClick={toggle}
        className={`w-10 h-5 rounded-full transition-all mt-5 -ml-7 ${isVertical ? "bg-red-600 hover:bg-red-700" : "bg-blue-700 hover:bg-blue-800"}`}
      />
    </div>
  );
};
