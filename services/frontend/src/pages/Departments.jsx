import React, { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/api/departmentApi";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import DepartmentForm from "@/components/DepartmentForm";
import { useNavigate } from "react-router-dom";

export default function Departments() {
  const [deps, setDeps] = useState([]);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    mode: "create",
    data: {},
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ----------------- API helpers ----------------- */
  const fetchDeps = async () => {
    try {
      const res = await getDepartments(token); // truyền token
      setDeps(res.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn!");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        alert("Không thể lấy danh sách phòng ban!");
      }
      setDeps([]);
    }
  };

  useEffect(() => {
    if (token) fetchDeps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = deps.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  /* ----------------- SAVE ----------------- */
  const handleSave = async (data) => {
    const payload = { name: data.name.trim() };

    try {
      if (dialog.mode === "create") {
        await createDepartment(payload, token);
      } else {
        await updateDepartment(dialog.data.id, payload, token);
      }
      setDialog({ open: false, mode: "create", data: {} });
      fetchDeps();
    } catch (err) {
      alert(err?.response?.data?.detail || "Lỗi xử lý phòng ban!");
    }
  };

  /* ----------------- DELETE ----------------- */
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá phòng ban này?")) {
      try {
        await deleteDepartment(id, token);
        fetchDeps();
      } catch (err) {
        alert(
          err?.response?.data?.detail || "Không xoá được! Có thể phòng ban còn nhân sự."
        );
      }
    }
  };

  /* ----------------- RENDER ----------------- */
  return (
    <div className="p-6 space-y-4 animate-fade-in bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-300">Quản lý Phòng ban</h1>
        <Button onClick={() => setDialog({ open: true, mode: "create", data: {} })}>
          + Thêm phòng
        </Button>
      </div>

      <Input
        placeholder="Tìm kiếm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-xs"
      />

      <div className="rounded-xl shadow bg-gray-800 text-gray-100 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Tên phòng</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={d.id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2">{d.name}</td>
                <td className="p-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setDialog({ open: true, mode: "edit", data: d })}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600"
                    onClick={() => handleDelete(d.id)}
                  >
                    Xoá
                  </Button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  Không có phòng ban!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, mode: "create", data: {} })}
      >
        <DepartmentForm
          defaultValues={dialog.data}
          onSave={handleSave}
          onClose={() => setDialog({ open: false, mode: "create", data: {} })}
        />
      </Dialog>
    </div>
  );
}
