import React, { useState } from "react";
import Input  from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function DepartmentForm({ defaultValues={}, onSave, onClose }) {
  const [name, setName] = useState(defaultValues.name || "");

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-900 p-6 rounded-xl">
      <label className="block text-gray-200">Tên phòng ban</label>
      <Input value={name} onChange={e => setName(e.target.value)} required className="w-full"/>
      <div className="flex gap-2 mt-2">
        <Button type="submit">{defaultValues.id ? "Cập nhật" : "Thêm mới"}</Button>
        <Button type="button" onClick={onClose} className="bg-gray-700">Huỷ</Button>
      </div>
    </form>
  );
}
