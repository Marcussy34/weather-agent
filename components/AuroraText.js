import React from "react";

export function AuroraText({
  children,
  className = "",
  colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8", "#a855f7", "#2dd4bf"],
  speed = 1,
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r animate-gradient-x"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 -z-10 block h-[calc(100%+4rem)] w-[calc(100%+4rem)] -translate-x-8 -translate-y-8 transform-gpu"
        style={{
          animation: `aurora ${4 / speed}s linear infinite`,
          backgroundImage: `conic-gradient(from 0deg at 50% 50%, ${colors.join(
            ", "
          )})`,
          filter: "blur(3rem)",
        }}
      />
    </span>
  );
}
