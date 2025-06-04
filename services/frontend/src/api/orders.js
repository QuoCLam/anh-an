const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách đơn hàng (có skip/limit, có thể truyền thêm search)
export async function fetchOrders({ skip = 0, limit = 100, search = "" } = {}) {
    let url = `${API_URL}/orders/?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Không thể tải đơn hàng (${res.status})`);
    return res.json();
}

// Tạo đơn mới
export async function createOrder(orderData) {
    const res = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error(`Tạo đơn hàng thất bại (status: ${res.status})`);
    return res.json();
}

// Cập nhật đơn hàng
export async function updateOrder(id, orderData) {
    const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error(`Sửa đơn hàng thất bại (status: ${res.status})`);
    return res.json();
}

// Xóa đơn hàng (phải đúng endpoint!)
export async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok)
    throw new Error(`Xóa đơn hàng thất bại (status: ${res.status})`);
  return res.json();
}