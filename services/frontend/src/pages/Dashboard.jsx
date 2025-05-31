import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        🏭 Hệ thống quản lý sản xuất – Anh An (ĐÃ SỬA MỚI 2025)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Đơn hàng */}
        <Link to="/orders" className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition block">
          <div className="text-xl font-semibold mb-2">Đơn hàng</div>
          <div className="text-gray-500 mb-1">Quản lý & theo dõi tiến độ đơn hàng sản xuất</div>
        </Link>

        {/* Card 2: Phòng Lab */}
        <Link to="/labtests" className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition block">
          <div className="text-xl font-semibold mb-2">Kiểm nghiệm (Phòng Lab)</div>
          <div className="text-gray-500 mb-1">Theo dõi và quản lý kết quả kiểm nghiệm sản phẩm</div>
        </Link>

        {/* Card 3: Phòng Thiết kế */}
        <Link to="/design" className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition block">
          <div className="text-xl font-semibold mb-2">Thiết kế</div>
          <div className="text-gray-500 mb-1">Quản lý file thiết kế, phê duyệt, bàn giao in ấn</div>
        </Link>

        {/* Card 4: Công bố pháp lý */}
        <Link to="/declare" className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition block">
          <div className="text-xl font-semibold mb-2">Đăng ký Công bố</div>
          <div className="text-gray-500 mb-1">Xử lý hồ sơ pháp lý, công bố sản phẩm</div>
        </Link>

        {/* Card 5: Thu mua */}
        <Link to="/purchasing" className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition block">
          <div className="text-xl font-semibold mb-2">Thu mua</div>
          <div className="text-gray-500 mb-1">Quản lý mua vật tư, đặt hàng, kiểm tra NCC</div>
        </Link>

        {/* Card 6: Tùy chọn mở rộng */}
        <div className="bg-white rounded-2xl shadow p-6 text-gray-400 flex items-center justify-center">
          + Module khác sẽ cập nhật sau...
        </div>
      </div>
    </div>
  );
}
