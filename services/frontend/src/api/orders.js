const API_URL = import.meta.env.VITE_API_URL;

export async function fetchOrders() {
    const res = await fetch(`${API_URL}/orders/?skip=0&limit=100`);
    if (!res.ok) throw new Error(`Không thể tải đơn hàng (${res.status})`);
    return res.json();
}

export async function createOrder(orderData) {
    const res = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error(`Tạo đơn hàng thất bại (status: ${res.status})`);
    return res.json();
}
