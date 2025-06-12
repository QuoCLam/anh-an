/* src/api/orders.js
 * Giao tiếp với ORDERS-service (port 8001)
 */
const API_URL = import.meta.env.VITE_ORDERS_API;  // <-- đã tách riêng

/* ---------- ENDPOINTS ---------- */

/** Lấy danh sách đơn (kèm phân trang / tìm kiếm) */
export async function fetchOrders({ skip = 0, limit = 100, search = "" } = {}) {
  let url = `${API_URL}/orders/?skip=${skip}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Không thể tải đơn hàng (HTTP ${res.status})`);
  return res.json();
}

/** Tạo đơn mới */
export async function createOrder(orderData) {
  const res = await fetch(`${API_URL}/orders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error(`Tạo đơn thất bại (HTTP ${res.status})`);
  return res.json();
}

/** Cập nhật đơn */
export async function updateOrder(id, orderData) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error(`Sửa đơn thất bại (HTTP ${res.status})`);
  return res.json();
}

/** Xoá đơn */
export async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Xoá đơn thất bại (HTTP ${res.status})`);
  return res.json();
}
