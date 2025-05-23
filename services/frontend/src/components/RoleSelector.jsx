import React from "react";
export default function RoleSelector({ role, setRole }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="font-semibold">Vai trò:</div>
      <select
        className="border p-2 rounded"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="manager">Quản lý</option>
        <option value="employee">Nhân viên</option>
      </select>
    </div>
  );
}
