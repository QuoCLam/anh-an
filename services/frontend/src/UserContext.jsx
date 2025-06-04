import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Giả định structure user như sau:
// {
//   name: "Admin tổng",
//   role: "admin",
//   permissions: ["departments:view", "departments:create", ...],
//   token: "access_token_string"
// }

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Đăng nhập
  const login = (userData) => {
    setUser(userData);
    // Lưu token vào localStorage (dự phòng context mất khi F5)
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    // Đẩy về trang login
    window.location.href = "/login"; // Hard reload để xóa sạch cache, kể cả context
  };

  // Kiểm tra permission động
  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (Array.isArray(user.permissions)) {
      return user.permissions.includes(perm);
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook dùng toàn hệ thống
export function useUser() {
  return useContext(UserContext);
}
