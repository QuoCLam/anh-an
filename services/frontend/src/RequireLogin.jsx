import React from "react";
import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function RequireLogin({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  return children;
}
