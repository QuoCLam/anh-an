import React, { useState } from "react";

export default function OrderForm({ onAdd }) {
  const [customer_name, setCustomerName] = useState("");
  const [order_date, setOrderDate] = useState("");
  const [delivery_date, setDeliveryDate] = useState("");
  const [note, setNote] = useState("");
  const [product_name, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("sp");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer_name || !order_date || !delivery_date || !product_name) return;
    onAdd({
      customer_name,
      order_date,
      delivery_date,
      note,
      items: [{ product_name, quantity: Number(quantity), unit }],
    });
    setCustomerName(""); setOrderDate(""); setDeliveryDate(""); setNote(""); setProductName(""); setQuantity(1); setUnit("sp");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Khách hàng</label>
        <input className="border rounded w-full px-2 py-1" value={customer_name} onChange={e => setCustomerName(e.target.value)} required />
      </div>
      <div className="flex gap-2">
        <div>
          <label>Ngày nhận</label>
          <input type="date" className="border rounded w-full px-2 py-1" value={order_date} onChange={e => setOrderDate(e.target.value)} required />
        </div>
        <div>
          <label>Ngày giao</label>
          <input type="date" className="border rounded w-full px-2 py-1" value={delivery_date} onChange={e => setDeliveryDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <label>Ghi chú</label>
        <input className="border rounded w-full px-2 py-1" value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <div>
          <label>Sản phẩm</label>
          <input className="border rounded w-full px-2 py-1" value={product_name} onChange={e => setProductName(e.target.value)} required />
        </div>
        <div>
          <label>Số lượng</label>
          <input type="number" className="border rounded w-full px-2 py-1" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" />
        </div>
        <div>
          <label>Đơn vị</label>
          <input className="border rounded w-full px-2 py-1" value={unit} onChange={e => setUnit(e.target.value)} required />
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl">Tạo đơn</button>
    </form>
  );
}
