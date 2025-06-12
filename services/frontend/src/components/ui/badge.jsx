import React from "react";

export default function Badge({ children, className = "", ...rest }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
