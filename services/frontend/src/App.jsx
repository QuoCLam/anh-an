import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import RequireLogin from "./RequireLogin";
import RequireRole from "./RequireRole";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LabTests from "./pages/LabTests";
import Orders from "./pages/Orders";
import Design from "./pages/Design";
import Declare from "./pages/Declare";
import Purchasing from "./pages/Purchasing";
import Departments from "./pages/Departments";
import Users from "./pages/Users";

// ====================== MENU SIDEBAR ==========================
const menu = [
  { to: "/", label: "Dashboard", roles: ["admin", "lab", "purchasing", "design", "declare"] },
  { to: "/orders", label: "Đơn hàng", roles: ["admin", "purchasing"] },
  { to: "/labtests", label: "Phòng Lab", roles: ["admin", "lab"] },
  { to: "/design", label: "Thiết kế", roles: ["admin", "design"] },
  { to: "/declare", label: "Công bố", roles: ["admin", "declare"] },
  { to: "/purchasing", label: "Thu mua", roles: ["admin", "purchasing"] },
  { to: "/departments", label: "Phòng ban", roles: ["admin"] },
  { to: "/users", label: "Nhân sự", roles: ["admin"] },
];

// ====================== SIDEBAR COMPONENT ====================
const Sidebar = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  if (!user) return null;

  return (
    <aside className="min-h-screen w-64 bg-white border-r flex flex-col shadow-lg">
      <div className="flex items-center h-16 px-6 border-b mb-2">
        <span className="font-extrabold text-xl text-blue-700">Anh An ERP</span>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {menu.filter(item => item.roles.includes(user.role)).map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium
                  ${location.pathname === item.to ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-blue-50"}
                  transition-all group`}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="mb-2 text-xs text-gray-500">Xin chào:</div>
        <div className="font-semibold text-blue-700">{user.name} ({user.role})</div>
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-100 text-red-700 rounded-xl py-2 font-bold hover:bg-red-200 transition"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

// ====================== MAIN APP & ROUTING ===================
function App() {
  const { user, login } = useUser();

  // Tự động đăng nhập lại nếu reload và localStorage còn token
  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem("token");
      if (token) {
        import("./api/userApi").then(({ getCurrentUser }) => {
          getCurrentUser(token).then(res => {
            const { username, role, permissions } = res.data;
            login({
              name: username,
              role,
              permissions: permissions || [],
              token: token
            });
          }).catch(() => {
            localStorage.removeItem("token");
          });
        });
      }
    }
  }, [user, login]);

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireLogin><Dashboard /></RequireLogin>} />
            <Route path="/orders" element={
              <RequireLogin>
                <RequireRole allow={["admin", "purchasing"]}>
                  <Orders />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="/labtests" element={
              <RequireLogin>
                <RequireRole allow={["admin", "lab"]}>
                  <LabTests />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="/design" element={
              <RequireLogin>
                <RequireRole allow={["admin", "design"]}>
                  <Design />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="/declare" element={
              <RequireLogin>
                <RequireRole allow={["admin", "declare"]}>
                  <Declare />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="/purchasing" element={
              <RequireLogin>
                <RequireRole allow={["admin", "purchasing"]}>
                  <Purchasing />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="/departments" element={
              <RequireLogin>
                <RequireRole allow={["admin"]}>
                  <Departments />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="/users" element={
              <RequireLogin>
                <RequireRole allow={["admin"]}>
                  <Users />
                </RequireRole>
              </RequireLogin>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
