"use client";

import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

interface RepeaterProps {
  containerClasses?: string;
  containerStyle?: CSSProperties;
  children: ReactElement;
}

const Repeater: React.FC<RepeaterProps> = ({ containerClasses = "", containerStyle, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const [repeatCount, setRepeatCount] = useState(0);
  const [childHeight, setChildHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const debouncedMeasure = useDebounceCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, 120);

  useEffect(() => {
    debouncedMeasure();
    window.addEventListener("resize", debouncedMeasure);
    return () => {
      window.removeEventListener("resize", debouncedMeasure);
      debouncedMeasure.cancel?.();
    };
  }, [debouncedMeasure]);

  useEffect(() => {
    if (childRef.current) {
      setChildHeight(childRef.current.clientHeight);
    }
  }, [children, childRef.current?.textContent]);

  useEffect(() => {
    if (childHeight > 0 && containerHeight > 0) {
      setRepeatCount(Math.ceil(containerHeight / childHeight));
    }
  }, [childHeight, containerHeight]);
  return (
    <div ref={containerRef} className={containerClasses} style={containerStyle}>
      {/* Hidden child for measuring */}
      <div className="absolute -left-[9999px] -top-[9999px] invisible -z-50 pointer-events-none h-auto overflow-visible whitespace-nowrap">
        <div ref={childRef}>{children}</div>
      </div>

      {/* Render repeated children */}
      {Array.from({ length: repeatCount }).map((_, idx) => React.cloneElement(children, { key: idx }))}
    </div>
  );
};

export default Repeater;
