import React from "react";

// props: value, onChange, ...rest (cho tự do truyền thêm thuộc tính)
export default function Input({ value, onChange, ...rest }) {
  return (
    <input
      value={value}
      onChange={onChange}
      className="border rounded px-2 py-1"
      {...rest}
    />
  );
}
