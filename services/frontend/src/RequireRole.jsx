import React from "react";
import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function RequireRole({ allow, children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (Array.isArray(allow) ? allow.includes(user.role) : user.role === allow || user.role === "admin")
    return children;
  return <div className="p-6 text-red-600 text-lg">Không có quyền truy cập chức năng này.</div>;
}
