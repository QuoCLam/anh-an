import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/userApi";
import { getDepartments } from "@/api/departmentApi";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dialog from "@/components/ui/dialog";

/* ----------------------- FORM COMPONENT ----------------------- */
function UserForm({ defaultValues = {}, departments = [], onSave, onClose }) {
  const [form, setForm] = useState({
    username: defaultValues.username || "",
    password: "",
    full_name: defaultValues.full_name || "",
    role: defaultValues.role || "user",
    phone: defaultValues.phone || "",
    email: defaultValues.email || "",
    department_id:
      defaultValues.department_id ??
      defaultValues.department?.id ??
      "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      department_id: form.department_id ? Number(form.department_id) : null,
    };
    if (defaultValues.id && payload.password.trim() === "") {
      delete payload.password; // không đổi pass khi edit
    }
    onSave(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-gray-900 p-6 rounded-xl"
    >
      {/* username */}
      <div>
        <label className="block text-gray-200">Tên đăng nhập</label>
        <Input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          disabled={!!defaultValues.id}
          className="w-full"
        />
      </div>

      {/* password */}
      <div>
        <label className="block text-gray-200">
          {defaultValues.id
            ? "Mật khẩu mới (bỏ trống nếu không đổi)"
            : "Mật khẩu"}
        </label>
        <Input
          name="password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={handleChange}
          required={!defaultValues.id}
          className="w-full"
        />
      </div>

      {/* fullname / role / phone / email */}
      <div>
        <label className="block text-gray-200">Họ tên</label>
        <Input name="full_name" value={form.full_name} onChange={handleChange} className="w-full" />
      </div>

      <div>
        <label className="block text-gray-200">Phòng ban</label>
        <select
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-gray-800 text-gray-100"
        >
          <option value="">-- Chưa chọn --</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-200">Chức vụ</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-gray-800 text-gray-100"
        >
          <option value="admin">Admin</option>
          <option value="user">Nhân viên</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-200">SĐT</label>
        <Input name="phone" value={form.phone} onChange={handleChange} className="w-full" />
      </div>

      <div>
        <label className="block text-gray-200">Email</label>
        <Input name="email" type="email" value={form.email} onChange={handleChange} className="w-full" />
      </div>

      <div className="flex gap-2 mt-2">
        <Button type="submit">{defaultValues.id ? "Cập nhật" : "Thêm mới"}</Button>
        <Button type="button" onClick={onClose} className="bg-gray-700">Huỷ</Button>
      </div>
    </form>
  );
}

/* ----------------------- MAIN COMPONENT ----------------------- */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "create", data: {} });
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [usrRes, depRes] = await Promise.all([
        getUsers(token),
        getDepartments(token),
      ]);
      setUsers(usrRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      alert("Không thể lấy dữ liệu (token hết hạn?)");
      setUsers([]); setDepartments([]);
    }
  };

  useEffect(() => { fetchData(); }, []);   /* componentDidMount */

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSave = async (data) => {
    try {
      if (dialog.mode === "create") await createUser(data, token);
      else await updateUser(dialog.data.id, data, token);

      setDialog({ open: false, mode: "create", data: {} });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.detail || "Lỗi lưu user!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá user?")) {
      try { await deleteUser(id, token); fetchData(); }
      catch { alert("Không xoá được user."); }
    }
  };

  return (
    <div className="p-6 space-y-4 animate-fade-in bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-300">Quản lý Nhân sự</h1>
        <Button onClick={() => setDialog({ open: true, mode: "create", data: {} })}>+ Thêm user</Button>
      </div>

      <Input placeholder="Tìm kiếm..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />

      <div className="rounded-xl shadow bg-gray-800 text-gray-100 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="p-2">#</th><th className="p-2">Tên đăng nhập</th>
              <th className="p-2">Họ tên</th><th className="p-2">Phòng ban</th>
              <th className="p-2">Chức vụ</th><th className="p-2">SĐT</th>
              <th className="p-2">Email</th><th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => (
              <tr key={u.id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.full_name}</td>
                <td className="p-2">{u.department?.name || ""}</td>
                <td className="p-2">{u.role === "admin" ? "Admin" : "Nhân viên"}</td>
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 flex gap-2">
                  <Button size="sm" onClick={() => setDialog({ open: true, mode: "edit", data: u })}>Sửa</Button>
                  <Button size="sm" className="bg-red-600" onClick={() => handleDelete(u.id)}>Xoá</Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Không có user!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, mode: "create", data: {} })}>
        <UserForm
          defaultValues={dialog.data}
          departments={departments}   /* ✨ truyền xuống */
          onSave={handleSave}
          onClose={() => setDialog({ open: false, mode: "create", data: {} })}
        />
      </Dialog>
    </div>
  );
}
