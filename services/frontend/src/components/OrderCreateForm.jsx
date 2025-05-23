import React, { useState } from 'react';
import axios from 'axios';

function OrderCreateForm({ onAdd }) {
  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [note, setNote] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = {
        customer_name: customerName,
        order_date: orderDate,
        delivery_date: deliveryDate,
        note,
        items: [
          {
            product_name: productName,
            quantity: Number(quantity),
            unit: unit
          }
        ]
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders/`, data);
      setMessage('Tạo đơn hàng thành công!');
      // Reset form
      setCustomerName('');
      setOrderDate('');
      setDeliveryDate('');
      setNote('');
      setProductName('');
      setQuantity(1);
      setUnit('');
      if (onAdd) onAdd(data); // optional callback
    } catch (error) {
      setMessage('Lỗi khi tạo đơn hàng!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ...giữ nguyên giao diện input... */}
      {/* Copy lại các input từ file cũ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium block mb-1">Khách hàng:</label>
          <input
            className="w-full border rounded-lg px-3 py-2 mb-2"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Ghi chú:</label>
          <input
            className="w-full border rounded-lg px-3 py-2 mb-2"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Ngày nhận đơn:</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 mb-2"
            value={orderDate}
            onChange={e => setOrderDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Ngày giao hàng:</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 mb-2"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="font-medium block mb-1">Thông tin sản phẩm</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Tên sản phẩm:</label>
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Tên SP"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Số lượng:</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-2 py-1"
              placeholder="Số lượng"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Đơn vị:</label>
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Đơn vị"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          Tạo đơn hàng
        </button>
      </div>
      {message && (
        <div className="text-center mt-2 font-bold"
          style={{ color: message.includes('thành công') ? 'green' : 'red' }}
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default OrderCreateForm;
