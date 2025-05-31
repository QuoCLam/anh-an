import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

// Import các trang lớn
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LabTests from "./pages/LabTests";
import Orders from "./pages/Orders";
import Design from "./pages/Design";
import Declare from "./pages/Declare";
import Purchasing from "./pages/Purchasing";

// Sidebar đơn giản, có thể tách ra component riêng nếu muốn
const Sidebar = () => (
  <div className="min-h-screen w-60 bg-gray-100 px-4 py-6">
    <div className="font-bold text-lg mb-4 text-blue-600">Anh An ERP</div>
    <ul className="space-y-2">
      <li>
        <Link to="/" className="block px-3 py-2 rounded hover:bg-blue-100">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/orders" className="block px-3 py-2 rounded hover:bg-blue-100">
          Đơn hàng
        </Link>
      </li>
      <li>
        <Link to="/labtests" className="block px-3 py-2 rounded hover:bg-blue-100">
          Phòng Lab
        </Link>
      </li>
      <li>
        <Link to="/design" className="block px-3 py-2 rounded hover:bg-blue-100">
          Thiết kế
        </Link>
      </li>
      <li>
        <Link to="/declare" className="block px-3 py-2 rounded hover:bg-blue-100">
          Công bố
        </Link>
      </li>
      <li>
        <Link to="/purchasing" className="block px-3 py-2 rounded hover:bg-blue-100">
          Thu mua
        </Link>
      </li>
      <li>
        <Link to="/login" className="block px-3 py-2 rounded hover:bg-blue-100">
          Đăng nhập
        </Link>
      </li>
    </ul>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/labtests" element={<LabTests />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/design" element={<Design />} />
            <Route path="/declare" element={<Declare />} />
            <Route path="/purchasing" element={<Purchasing />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
